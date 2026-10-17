<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure Super Admin role exists
        $role = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);

        // Creating Super Admin User
        $superAdmin = User::firstOrCreate(
            ['email' => 'rezwanahmedratul007@gmail.com'],
            [
                'name' => 'Ratul',
                'password' => Hash::make('rezwanahmedratul007@gmail.com'),
            ]
        );

        $superAdmin->assignRole($role);
    }
}
