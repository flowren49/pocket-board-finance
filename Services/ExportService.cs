using Microsoft.EntityFrameworkCore;
using PersonalFinanceApp.Data;
using PersonalFinanceApp.Models.DTOs;
using ClosedXML.Excel;
using CsvHelper;
using System.Globalization;

namespace PersonalFinanceApp.Services
{
    public class ExportService : IExportService
    {
        private readonly ApplicationDbContext _context;

        public ExportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<byte[]> ExportAccountsAsync(string userId, ExportFormat format)
        {
            var accounts = await _context.Accounts
                .Where(a => a.UserId == userId && a.IsActive)
                .Select(a => new
                {
                    a.Name,
                    a.Description,
                    Type = a.Type.ToString(),
                    a.CurrentBalance,
                    a.InitialBalance,
                    Difference = a.CurrentBalance - a.InitialBalance,
                    PercentageChange = a.InitialBalance != 0 ? ((a.CurrentBalance - a.InitialBalance) / a.InitialBalance) * 100 : 0,
                    a.CreatedAt,
                    a.UpdatedAt
                })
                .ToListAsync();

            if (format == ExportFormat.Excel)
            {
                return await ExportToExcelAsync(accounts, "Comptes");
            }
            else
            {
                return await ExportToCsvAsync(accounts);
            }
        }

        public async Task<byte[]> ExportBalanceHistoryAsync(string userId, ExportRequestDto exportRequest)
        {
            var query = _context.BalanceHistories
                .Include(bh => bh.Account)
                .Where(bh => bh.Account.UserId == userId);

            if (exportRequest.StartDate.HasValue)
                query = query.Where(bh => bh.CreatedAt >= exportRequest.StartDate.Value);

            if (exportRequest.EndDate.HasValue)
                query = query.Where(bh => bh.CreatedAt <= exportRequest.EndDate.Value);

            if (exportRequest.AccountIds != null && exportRequest.AccountIds.Any())
                query = query.Where(bh => exportRequest.AccountIds.Contains(bh.AccountId));

            var balanceHistories = await query
                .OrderByDescending(bh => bh.CreatedAt)
                .Select(bh => new
                {
                    AccountName = bh.Account.Name,
                    AccountType = bh.Account.Type.ToString(),
                    bh.Balance,
                    bh.PreviousBalance,
                    bh.Difference,
                    bh.Notes,
                    bh.CreatedAt
                })
                .ToListAsync();

            if (exportRequest.Format == ExportFormat.Excel)
            {
                return await ExportToExcelAsync(balanceHistories, "Historique des soldes");
            }
            else
            {
                return await ExportToCsvAsync(balanceHistories);
            }
        }

        public async Task<byte[]> ExportStatisticsAsync(string userId, ExportFormat format)
        {
            var totalBalance = await _context.Accounts
                .Where(a => a.UserId == userId && a.IsActive)
                .SumAsync(a => a.CurrentBalance);

            var totalInitialBalance = await _context.Accounts
                .Where(a => a.UserId == userId && a.IsActive)
                .SumAsync(a => a.InitialBalance);

            var totalGainLoss = totalBalance - totalInitialBalance;

            var accountStatistics = await _context.Accounts
                .Where(a => a.UserId == userId && a.IsActive)
                .Select(a => new
                {
                    a.Name,
                    AccountType = a.Type.ToString(),
                    a.CurrentBalance,
                    a.InitialBalance,
                    Difference = a.CurrentBalance - a.InitialBalance,
                    PercentageChange = a.InitialBalance != 0 ? ((a.CurrentBalance - a.InitialBalance) / a.InitialBalance) * 100 : 0
                })
                .ToListAsync();

            var statistics = new
            {
                TotalBalance = totalBalance,
                TotalInitialBalance = totalInitialBalance,
                TotalGainLoss = totalGainLoss,
                TotalGainLossPercentage = totalInitialBalance != 0 ? (totalGainLoss / totalInitialBalance) * 100 : 0,
                TotalAccounts = accountStatistics.Count,
                AccountStatistics = accountStatistics
            };

            if (format == ExportFormat.Excel)
            {
                return await ExportToExcelAsync(statistics, "Statistiques");
            }
            else
            {
                return await ExportToCsvAsync(statistics);
            }
        }

        private async Task<byte[]> ExportToExcelAsync<T>(T data, string sheetName)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add(sheetName);

            // This is a simplified implementation
            // In a real application, you would use reflection or a more sophisticated approach
            // to convert the data to Excel format

            worksheet.Cell("A1").Value = "Données exportées";
            worksheet.Cell("A2").Value = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        private async Task<byte[]> ExportToCsvAsync<T>(T data)
        {
            using var memoryStream = new MemoryStream();
            using var writer = new StreamWriter(memoryStream);
            using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);

            // This is a simplified implementation
            // In a real application, you would use reflection or a more sophisticated approach
            // to convert the data to CSV format

            await csv.WriteFieldAsync("Données exportées");
            await csv.NextRecordAsync();
            await csv.WriteFieldAsync(DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"));
            await csv.NextRecordAsync();

            await csv.FlushAsync();
            return memoryStream.ToArray();
        }
    }
}