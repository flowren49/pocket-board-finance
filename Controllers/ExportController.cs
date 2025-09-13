using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalFinanceApp.Models.DTOs;
using PersonalFinanceApp.Services;
using System.Security.Claims;

namespace PersonalFinanceApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ExportController : ControllerBase
    {
        private readonly IExportService _exportService;
        private readonly ILogger<ExportController> _logger;

        public ExportController(IExportService exportService, ILogger<ExportController> logger)
        {
            _exportService = exportService;
            _logger = logger;
        }

        [HttpGet("accounts")]
        public async Task<IActionResult> ExportAccounts([FromQuery] ExportFormat format = ExportFormat.Excel)
        {
            try
            {
                var userId = GetCurrentUserId();
                var fileBytes = await _exportService.ExportAccountsAsync(userId, format);
                
                var fileName = $"comptes_{DateTime.Now:yyyyMMdd_HHmmss}.{(format == ExportFormat.Excel ? "xlsx" : "csv")}";
                var contentType = format == ExportFormat.Excel ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "text/csv";
                
                return File(fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'export des comptes pour l'utilisateur {UserId}", GetCurrentUserId());
                return StatusCode(500, new { message = "Une erreur interne s'est produite lors de l'export." });
            }
        }

        [HttpGet("balance-history")]
        public async Task<IActionResult> ExportBalanceHistory([FromQuery] ExportRequestDto exportRequest)
        {
            try
            {
                var userId = GetCurrentUserId();
                var fileBytes = await _exportService.ExportBalanceHistoryAsync(userId, exportRequest);
                
                var fileName = $"historique_soldes_{DateTime.Now:yyyyMMdd_HHmmss}.{(exportRequest.Format == ExportFormat.Excel ? "xlsx" : "csv")}";
                var contentType = exportRequest.Format == ExportFormat.Excel ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "text/csv";
                
                return File(fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'export de l'historique des soldes pour l'utilisateur {UserId}", GetCurrentUserId());
                return StatusCode(500, new { message = "Une erreur interne s'est produite lors de l'export." });
            }
        }

        [HttpGet("statistics")]
        public async Task<IActionResult> ExportStatistics([FromQuery] ExportFormat format = ExportFormat.Excel)
        {
            try
            {
                var userId = GetCurrentUserId();
                var fileBytes = await _exportService.ExportStatisticsAsync(userId, format);
                
                var fileName = $"statistiques_{DateTime.Now:yyyyMMdd_HHmmss}.{(format == ExportFormat.Excel ? "xlsx" : "csv")}";
                var contentType = format == ExportFormat.Excel ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "text/csv";
                
                return File(fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'export des statistiques pour l'utilisateur {UserId}", GetCurrentUserId());
                return StatusCode(500, new { message = "Une erreur interne s'est produite lors de l'export." });
            }
        }

        private string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }
    }
}