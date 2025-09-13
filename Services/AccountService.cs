using Microsoft.EntityFrameworkCore;
using PersonalFinanceApp.Data;
using PersonalFinanceApp.Models;
using PersonalFinanceApp.Models.DTOs;

namespace PersonalFinanceApp.Services
{
    public class AccountService : IAccountService
    {
        private readonly ApplicationDbContext _context;
        private readonly IBalanceHistoryService _balanceHistoryService;

        public AccountService(ApplicationDbContext context, IBalanceHistoryService balanceHistoryService)
        {
            _context = context;
            _balanceHistoryService = balanceHistoryService;
        }

        public async Task<IEnumerable<AccountDto>> GetUserAccountsAsync(string userId)
        {
            var accounts = await _context.Accounts
                .Where(a => a.UserId == userId && a.IsActive)
                .OrderBy(a => a.Name)
                .Select(a => new AccountDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    Type = a.Type,
                    CurrentBalance = a.CurrentBalance,
                    InitialBalance = a.InitialBalance,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt,
                    IsActive = a.IsActive
                })
                .ToListAsync();

            return accounts;
        }

        public async Task<AccountDto?> GetAccountByIdAsync(int accountId, string userId)
        {
            var account = await _context.Accounts
                .Where(a => a.Id == accountId && a.UserId == userId && a.IsActive)
                .Select(a => new AccountDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    Type = a.Type,
                    CurrentBalance = a.CurrentBalance,
                    InitialBalance = a.InitialBalance,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt,
                    IsActive = a.IsActive
                })
                .FirstOrDefaultAsync();

            return account;
        }

        public async Task<AccountDto> CreateAccountAsync(CreateAccountDto createAccountDto, string userId)
        {
            var account = new Account
            {
                Name = createAccountDto.Name,
                Description = createAccountDto.Description,
                Type = createAccountDto.Type,
                InitialBalance = createAccountDto.InitialBalance,
                CurrentBalance = createAccountDto.InitialBalance,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            // Create initial balance history entry
            await _balanceHistoryService.CreateBalanceHistoryAsync(new CreateBalanceHistoryDto
            {
                AccountId = account.Id,
                NewBalance = account.InitialBalance,
                Notes = "Solde initial"
            }, userId);

            return new AccountDto
            {
                Id = account.Id,
                Name = account.Name,
                Description = account.Description,
                Type = account.Type,
                CurrentBalance = account.CurrentBalance,
                InitialBalance = account.InitialBalance,
                CreatedAt = account.CreatedAt,
                UpdatedAt = account.UpdatedAt,
                IsActive = account.IsActive
            };
        }

        public async Task<AccountDto> UpdateAccountAsync(int accountId, UpdateAccountDto updateAccountDto, string userId)
        {
            var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Id == accountId && a.UserId == userId && a.IsActive);

            if (account == null)
                throw new ArgumentException("Compte non trouvé");

            account.Name = updateAccountDto.Name;
            account.Description = updateAccountDto.Description;
            account.Type = updateAccountDto.Type;
            account.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new AccountDto
            {
                Id = account.Id,
                Name = account.Name,
                Description = account.Description,
                Type = account.Type,
                CurrentBalance = account.CurrentBalance,
                InitialBalance = account.InitialBalance,
                CreatedAt = account.CreatedAt,
                UpdatedAt = account.UpdatedAt,
                IsActive = account.IsActive
            };
        }

        public async Task<bool> DeleteAccountAsync(int accountId, string userId)
        {
            var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Id == accountId && a.UserId == userId && a.IsActive);

            if (account == null)
                return false;

            account.IsActive = false;
            account.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<AccountDto> UpdateBalanceAsync(int accountId, UpdateBalanceDto updateBalanceDto, string userId)
        {
            var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Id == accountId && a.UserId == userId && a.IsActive);

            if (account == null)
                throw new ArgumentException("Compte non trouvé");

            var previousBalance = account.CurrentBalance;
            account.CurrentBalance = updateBalanceDto.NewBalance;
            account.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Create balance history entry
            await _balanceHistoryService.CreateBalanceHistoryAsync(new CreateBalanceHistoryDto
            {
                AccountId = accountId,
                NewBalance = updateBalanceDto.NewBalance,
                Notes = updateBalanceDto.Notes
            }, userId);

            return new AccountDto
            {
                Id = account.Id,
                Name = account.Name,
                Description = account.Description,
                Type = account.Type,
                CurrentBalance = account.CurrentBalance,
                InitialBalance = account.InitialBalance,
                CreatedAt = account.CreatedAt,
                UpdatedAt = account.UpdatedAt,
                IsActive = account.IsActive
            };
        }

        public async Task<IEnumerable<BalanceHistoryDto>> GetAccountBalanceHistoryAsync(int accountId, string userId, int page = 1, int pageSize = 50)
        {
            return await _balanceHistoryService.GetAccountBalanceHistoryAsync(accountId, userId, page, pageSize);
        }

        public async Task<decimal> GetTotalBalanceAsync(string userId)
        {
            return await _context.Accounts
                .Where(a => a.UserId == userId && a.IsActive)
                .SumAsync(a => a.CurrentBalance);
        }

        public async Task<decimal> GetTotalInitialBalanceAsync(string userId)
        {
            return await _context.Accounts
                .Where(a => a.UserId == userId && a.IsActive)
                .SumAsync(a => a.InitialBalance);
        }
    }
}