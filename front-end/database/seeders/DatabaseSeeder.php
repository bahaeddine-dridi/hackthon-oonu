<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Student;
use App\Models\WeeklyMenu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin
        Admin::create([
            'name' => 'Admin OOUN',
            'email' => 'admin@ooun.tn',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Create Sample Students
        Student::create([
            'student_id' => 'STU001',
            'name' => 'Ahmed Ben Ali',
            'email' => 'ahmed@student.tn',
            'university' => 'OOUN Tunisia',
            'password' => Hash::make('password123'),
            'wallet_balance' => 50.00,
            'points' => 100,
        ]);

        Student::create([
            'student_id' => 'STU002',
            'name' => 'Fatima Mahmoud',
            'email' => 'fatima@student.tn',
            'university' => 'OOUN Tunisia',
            'password' => Hash::make('password123'),
            'wallet_balance' => 30.00,
            'points' => 50,
        ]);

        Student::create([
            'student_id' => 'STU003',
            'name' => 'Mohamed Hassan',
            'email' => 'mohamed@student.tn',
            'university' => 'OOUN Tunisia',
            'password' => Hash::make('password123'),
            'wallet_balance' => 75.00,
            'points' => 200,
        ]);

        // Create Weekly Menus
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        $meals = [
            'breakfast' => [
                ['title' => 'Croissant & Coffee', 'tags' => ['quick', 'popular']],
                ['title' => 'Omelette & Toast', 'tags' => ['protein', 'healthy']],
                ['title' => 'Pancakes & Juice', 'tags' => ['sweet', 'popular']],
            ],
            'lunch' => [
                ['title' => 'Couscous', 'tags' => ['traditional', 'popular', 'halal']],
                ['title' => 'Grilled Chicken with Rice', 'tags' => ['protein', 'healthy']],
                ['title' => 'Pasta Bolognese', 'tags' => ['italian', 'popular']],
                ['title' => 'Fish with Vegetables', 'tags' => ['healthy', 'omega-3']],
                ['title' => 'Vegetarian Tajine', 'tags' => ['vegetarian', 'traditional', 'healthy']],
            ],
            'dinner' => [
                ['title' => 'Sandwich & Salad', 'tags' => ['light', 'quick']],
                ['title' => 'Pizza Slice', 'tags' => ['popular', 'quick']],
                ['title' => 'Soup & Bread', 'tags' => ['light', 'healthy']],
            ],
        ];

        foreach ($days as $dayIndex => $day) {
            // Breakfast
            $breakfast = $meals['breakfast'][$dayIndex % count($meals['breakfast'])];
            WeeklyMenu::create([
                'day' => $day,
                'meal_type' => 'breakfast',
                'title' => $breakfast['title'],
                'tags' => $breakfast['tags'],
                'status' => 'available',
            ]);

            // Lunch
            $lunch = $meals['lunch'][$dayIndex % count($meals['lunch'])];
            WeeklyMenu::create([
                'day' => $day,
                'meal_type' => 'lunch',
                'title' => $lunch['title'],
                'tags' => $lunch['tags'],
                'status' => 'available',
            ]);

            // Dinner
            $dinner = $meals['dinner'][$dayIndex % count($meals['dinner'])];
            WeeklyMenu::create([
                'day' => $day,
                'meal_type' => 'dinner',
                'title' => $dinner['title'],
                'tags' => $dinner['tags'],
                'status' => 'available',
            ]);
        }

        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('');
        $this->command->info('📝 Admin Credentials:');
        $this->command->info('   Email: admin@ooun.tn');
        $this->command->info('   Password: admin123');
        $this->command->info('');
        $this->command->info('📝 Student Credentials:');
        $this->command->info('   Student ID: STU001, STU002, STU003');
        $this->command->info('   Password: password123');
    }
}
