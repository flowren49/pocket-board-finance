using Microsoft.AspNetCore.Identity;
using PersonalFinanceApp.Models;

namespace PersonalFinanceApp.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Create default admin user if no users exist
            if (!context.Users.Any())
            {
                var adminUser = new ApplicationUser
                {
                    UserName = "admin@personalfinance.com",
                    Email = "admin@personalfinance.com",
                    FirstName = "Admin",
                    LastName = "User",
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(adminUser, "Admin123!");
                
                if (result.Succeeded)
                {
                    // Create some sample accounts for the admin user
                    var sampleAccounts = new List<Account>
                    {
                        new Account
                        {
                            Name = "Compte Courant Principal",
                            Description = "Compte principal pour les dépenses quotidiennes",
                            Type = AccountType.Checking,
                            InitialBalance = 2500.00m,
                            CurrentBalance = 2500.00m,
                            UserId = adminUser.Id,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            IsActive = true
                        },
                        new Account
                        {
                            Name = "Livret A",
                            Description = "Épargne de précaution",
                            Type = AccountType.Savings,
                            InitialBalance = 5000.00m,
                            CurrentBalance = 5000.00m,
                            UserId = adminUser.Id,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            IsActive = true
                        },
                        new Account
                        {
                            Name = "Carte de Crédit",
                            Description = "Carte de crédit principale",
                            Type = AccountType.Credit,
                            InitialBalance = -500.00m,
                            CurrentBalance = -500.00m,
                            UserId = adminUser.Id,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            IsActive = true
                        }
                    };

                    context.Accounts.AddRange(sampleAccounts);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}