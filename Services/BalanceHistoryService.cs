using Microsoft.EntityFrameworkCore;
using PersonalFinanceApp.Data;
using PersonalFinanceApp.Models.DTOs;

namespace PersonalFinanceApp.Services
{
    public class BalanceHistoryService : IBalanceHistoryService
    {
        private readonly ApplicationDbContext _context;

        public BalanceHistoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BalanceHistoryDto>> GetAccountBalanceHistoryAsync(int accountId, string userId, int page = 1, int pageSize = 50)
        {
            var query = _context.BalanceHistories
                .Include(bh => bh.Account)
                .Where(bh => bh.AccountId == accountId && bh.Account.UserId == userId)
                .OrderByDescending(bh => bh.CreatedAt);

            var balanceHistories = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(bh => new BalanceHistoryDto
                {
                    Id = bh.Id,
                    Balance = bh.Balance,
                    PreviousBalance = bh.PreviousBalance,
                    Difference = bh.Difference,
                    Notes = bh.Notes,
                    CreatedAt = bh.CreatedAt,
                    AccountId = bh.AccountId,
                    AccountName = bh.Account.Name
                })
                .ToListAsync();

            return balanceHistories;
        }

        public async Task<BalanceHistoryDto> CreateBalanceHistoryAsync(CreateBalanceHistoryDto createBalanceHistoryDto, string userId)
        {
            // Verify the account belongs to the user
            var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Id == createBalanceHistoryDto.AccountId && a.UserId == userId && a.IsActive);

            if (account == null)
                throw new ArgumentException("Compte non trouvé");

            var previousBalance = account.CurrentBalance;

            var balanceHistory = new BalanceHistory
            {
                AccountId = createBalanceHistoryDto.AccountId,
                Balance = createBalanceHistoryDto.NewBalance,
                PreviousBalance = previousBalance,
                Difference = createBalanceHistoryDto.NewBalance - previousBalance,
                Notes = createBalanceHistoryDto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.BalanceHistories.Add(balanceHistory);
            await _context.SaveChangesAsync();

            return new BalanceHistoryDto
            {
                Id = balanceHistory.Id,
                Balance = balanceHistory.Balance,
                PreviousBalance = balanceHistory.PreviousBalance,
                Difference = balanceHistory.Difference,
                Notes = balanceHistory.Notes,
                CreatedAt = balanceHistory.CreatedAt,
                AccountId = balanceHistory.AccountId,
                AccountName = account.Name
            };
        }

        public async Task<IEnumerable<BalanceHistoryDto>> GetUserBalanceHistoryAsync(string userId, DateTime? startDate = null, DateTime? endDate = null, int page = 1, int pageSize = 50)
        {
            var query = _context.BalanceHistories
                .Include(bh => bh.Account)
                .Where(bh => bh.Account.UserId == userId);

            if (startDate.HasValue)
                query = query.Where(bh => bh.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(bh => bh.CreatedAt <= endDate.Value);

            var balanceHistories = await query
                .OrderByDescending(bh => bh.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(bh => new BalanceHistoryDto
                {
                    Id = bh.Id,
                    Balance = bh.Balance,
                    PreviousBalance = bh.PreviousBalance,
                    Difference = bh.Difference,
                    Notes = bh.Notes,
                    CreatedAt = bh.CreatedAt,
                    AccountId = bh.AccountId,
                    AccountName = bh.Account.Name
                })
                .ToListAsync();

            return balanceHistories;
        }
    }
}