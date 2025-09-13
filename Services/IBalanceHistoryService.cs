using PersonalFinanceApp.Models.DTOs;

namespace PersonalFinanceApp.Services
{
    public interface IBalanceHistoryService
    {
        Task<IEnumerable<BalanceHistoryDto>> GetAccountBalanceHistoryAsync(int accountId, string userId, int page = 1, int pageSize = 50);
        Task<BalanceHistoryDto> CreateBalanceHistoryAsync(CreateBalanceHistoryDto createBalanceHistoryDto, string userId);
        Task<IEnumerable<BalanceHistoryDto>> GetUserBalanceHistoryAsync(string userId, DateTime? startDate = null, DateTime? endDate = null, int page = 1, int pageSize = 50);
    }
}