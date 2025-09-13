using PersonalFinanceApp.Models.DTOs;

namespace PersonalFinanceApp.Services
{
    public interface IExportService
    {
        Task<byte[]> ExportAccountsAsync(string userId, ExportFormat format);
        Task<byte[]> ExportBalanceHistoryAsync(string userId, ExportRequestDto exportRequest);
        Task<byte[]> ExportStatisticsAsync(string userId, ExportFormat format);
    }
}