using Microsoft.EntityFrameworkCore;
using PersonalFinanceApp.Data;
using PersonalFinanceApp.Models;
using PersonalFinanceApp.Models.DTOs;
using PersonalFinanceApp.Services;
using Xunit;

namespace PersonalFinanceApp.Tests.Services
{
    public class AccountServiceTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly AccountService _accountService;
        private readonly BalanceHistoryService _balanceHistoryService;
        private readonly string _testUserId;

        public AccountServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _balanceHistoryService = new BalanceHistoryService(_context);
            _accountService = new AccountService(_context, _balanceHistoryService);
            _testUserId = Guid.NewGuid().ToString();
        }

        [Fact]
        public async Task CreateAccountAsync_ShouldCreateAccountSuccessfully()
        {
            // Arrange
            var createAccountDto = new CreateAccountDto
            {
                Name = "Test Account",
                Description = "Test Description",
                Type = AccountType.Checking,
                InitialBalance = 1000.00m
            };

            // Act
            var result = await _accountService.CreateAccountAsync(createAccountDto, _testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Account", result.Name);
            Assert.Equal(AccountType.Checking, result.Type);
            Assert.Equal(1000.00m, result.CurrentBalance);
            Assert.Equal(1000.00m, result.InitialBalance);
            Assert.True(result.IsActive);

            // Verify account was saved to database
            var savedAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == result.Id);
            Assert.NotNull(savedAccount);
            Assert.Equal(_testUserId, savedAccount.UserId);
        }

        [Fact]
        public async Task GetUserAccountsAsync_ShouldReturnOnlyUserAccounts()
        {
            // Arrange
            var otherUserId = Guid.NewGuid().ToString();
            
            // Create accounts for test user
            var account1 = new Account
            {
                Name = "Account 1",
                Type = AccountType.Checking,
                InitialBalance = 1000,
                CurrentBalance = 1000,
                UserId = _testUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            var account2 = new Account
            {
                Name = "Account 2",
                Type = AccountType.Savings,
                InitialBalance = 2000,
                CurrentBalance = 2000,
                UserId = _testUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            // Create account for other user
            var otherAccount = new Account
            {
                Name = "Other Account",
                Type = AccountType.Checking,
                InitialBalance = 500,
                CurrentBalance = 500,
                UserId = otherUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Accounts.AddRange(account1, account2, otherAccount);
            await _context.SaveChangesAsync();

            // Act
            var result = await _accountService.GetUserAccountsAsync(_testUserId);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.All(result, account => Assert.Equal(_testUserId, account.UserId));
        }

        [Fact]
        public async Task UpdateBalanceAsync_ShouldUpdateBalanceAndCreateHistory()
        {
            // Arrange
            var account = new Account
            {
                Name = "Test Account",
                Type = AccountType.Checking,
                InitialBalance = 1000,
                CurrentBalance = 1000,
                UserId = _testUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            var updateBalanceDto = new UpdateBalanceDto
            {
                NewBalance = 1500.00m,
                Notes = "Test update"
            };

            // Act
            var result = await _accountService.UpdateBalanceAsync(account.Id, updateBalanceDto, _testUserId);

            // Assert
            Assert.Equal(1500.00m, result.CurrentBalance);

            // Verify balance history was created
            var history = await _context.BalanceHistories
                .FirstOrDefaultAsync(bh => bh.AccountId == account.Id);

            Assert.NotNull(history);
            Assert.Equal(1500.00m, history.Balance);
            Assert.Equal(1000.00m, history.PreviousBalance);
            Assert.Equal(500.00m, history.Difference);
            Assert.Equal("Test update", history.Notes);
        }

        [Fact]
        public async Task DeleteAccountAsync_ShouldSoftDeleteAccount()
        {
            // Arrange
            var account = new Account
            {
                Name = "Test Account",
                Type = AccountType.Checking,
                InitialBalance = 1000,
                CurrentBalance = 1000,
                UserId = _testUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            // Act
            var result = await _accountService.DeleteAccountAsync(account.Id, _testUserId);

            // Assert
            Assert.True(result);

            var deletedAccount = await _context.Accounts.FindAsync(account.Id);
            Assert.NotNull(deletedAccount);
            Assert.False(deletedAccount.IsActive);
        }

        [Fact]
        public async Task GetTotalBalanceAsync_ShouldReturnCorrectTotal()
        {
            // Arrange
            var accounts = new[]
            {
                new Account
                {
                    Name = "Account 1",
                    Type = AccountType.Checking,
                    InitialBalance = 1000,
                    CurrentBalance = 1200,
                    UserId = _testUserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                },
                new Account
                {
                    Name = "Account 2",
                    Type = AccountType.Savings,
                    InitialBalance = 2000,
                    CurrentBalance = 2300,
                    UserId = _testUserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                },
                new Account
                {
                    Name = "Account 3",
                    Type = AccountType.Credit,
                    InitialBalance = -500,
                    CurrentBalance = -300,
                    UserId = _testUserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                }
            };

            _context.Accounts.AddRange(accounts);
            await _context.SaveChangesAsync();

            // Act
            var totalBalance = await _accountService.GetTotalBalanceAsync(_testUserId);

            // Assert
            Assert.Equal(3200.00m, totalBalance); // 1200 + 2300 + (-300)
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}