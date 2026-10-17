<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommentList;
use App\Models\PackagePurchaseRequest;
use App\Models\MainSiteData;
use App\Models\PackageList;
use App\Models\CustomerReview;
use App\Models\CustomersInfo;
use App\Models\Voucher;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PublicFrontendController extends Controller
{
    /**
     * Return public data for SPA or hydration.
     */
    public function getInitialData()
    {
        $siteData = MainSiteData::getActive();
        $packages = PackageList::orderBy('sort_order')
            ->where('show_on_site', true)
            ->get();

        $reviews = CustomerReview::with(['pppUser.customer'])
            ->where('show_on_site', true)
            ->latest()
            ->get();

        $uniqueVisitors = 2000 + \App\Models\SiteVisitor::distinct('ip_address')->count();
        $totalVisits = 5000 + \App\Models\SiteVisitor::count();

        return response()->json([
            'siteData' => $siteData,
            'packages' => $packages,
            'reviews' => $reviews,
            'uniqueVisitors' => $uniqueVisitors,
            'totalVisits' => $totalVisits,
        ]);
    }

    /**
     * Submit contact form message.
     */
    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'comment' => 'required|string|max:2000',
        ]);

        if (empty($validated['phone']) && empty($validated['email'])) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide either a phone number or an email address.',
            ], 422);
        }

        CommentList::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'comment' => $validated['comment'],
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your message has been received! We will get back to you shortly.',
        ]);
    }

    /**
     * Submit new connection / package order inquiry.
     */
    public function submitOrder(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'email' => 'nullable|email|max:255',
            'address' => 'required|string|max:1000',
            'package_name' => 'required|string|max:255',
            'price' => 'nullable|numeric',
            'notes' => 'nullable|string|max:1000',
        ]);

        $order = PackagePurchaseRequest::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'],
            'package_name' => $validated['package_name'],
            'price' => $validated['price'] ?? 0,
            'status' => 'pending',
            'ip_address' => $request->ip(),
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Order for {$validated['package_name']} placed successfully! Our field engineer will contact you.",
            'order_id' => $order->id,
        ]);
    }

    /**
     * Quick Voucher recharge API.
     */
    public function rechargeVoucher(Request $request, PaymentService $paymentService)
    {
        $request->validate([
            'username' => 'required|string|max:100',
            'code' => 'required|string|max:50',
        ]);

        $customer = CustomersInfo::where('customer_unique_id', $request->username)
            ->orWhereHas('pppUser', function ($q) use ($request) {
                $q->where('username', $request->username);
            })
            ->first();

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer account or PPPoE username not found.',
            ], 404);
        }

        $voucher = Voucher::where('code', $request->code)->first();

        if (!$voucher) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid voucher code. Please check and try again.',
            ], 422);
        }

        if (!$voucher->isUnused()) {
            return response()->json([
                'success' => false,
                'message' => 'This voucher has already been used.',
            ], 422);
        }

        if ($voucher->isExpired()) {
            return response()->json([
                'success' => false,
                'message' => 'This voucher has expired.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            if ($voucher->type === 'package_based' && $voucher->package_id) {
                $package = $voucher->package;
                if ($package) {
                    $customer->package_id = $package->id;
                    $customer->save();

                    if ($customer->billing) {
                        $customer->billing->monthly_rent = (float) $package->price;
                        $customer->billing->total_amount = (float) $package->price
                            + (float)($customer->billing->additional_charge ?? 0)
                            + (float)($customer->billing->vat ?? 0)
                            - (float)($customer->billing->discount ?? 0);
                        $customer->billing->due_amount = $customer->billing->total_amount - (float)($customer->billing->paid_amount ?? 0);
                        $customer->billing->save();
                    }

                    if ($customer->pppUser) {
                        $customer->pppUser->profile = $package->package;
                        $customer->pppUser->save();
                    }
                }
            }

            $voucher->update([
                'status' => 'used',
                'used_by_customer_id' => $customer->id,
                'used_at' => now(),
            ]);

            $success = $paymentService->processSuccessPayment(
                $customer,
                (float) $voucher->value,
                'voucher',
                $voucher->code
            );

            if ($success) {
                DB::commit();
                return response()->json([
                    'success' => true,
                    'message' => "Account successfully recharged with BDT {$voucher->value}! Your internet service is now active.",
                    'amount' => $voucher->value,
                ]);
            } else {
                throw new \Exception("Payment processing failed.");
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Voucher redemption failed via API: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Recharge failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
