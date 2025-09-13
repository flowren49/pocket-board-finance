using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace PersonalFinanceApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly HealthCheckService _healthCheckService;

        public HealthController(HealthCheckService healthCheckService)
        {
            _healthCheckService = healthCheckService;
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var healthCheckResult = await _healthCheckService.CheckHealthAsync();
            
            var status = healthCheckResult.Status == HealthStatus.Healthy 
                ? "healthy" 
                : healthCheckResult.Status == HealthStatus.Degraded 
                    ? "degraded" 
                    : "unhealthy";

            var response = new
            {
                status = status,
                totalDuration = healthCheckResult.TotalDuration,
                entries = healthCheckResult.Entries.Select(entry => new
                {
                    name = entry.Key,
                    status = entry.Value.Status.ToString().ToLower(),
                    duration = entry.Value.Duration,
                    description = entry.Value.Description,
                    data = entry.Value.Data
                })
            };

            return healthCheckResult.Status == HealthStatus.Healthy 
                ? Ok(response) 
                : StatusCode(503, response);
        }

        [HttpGet("ready")]
        public async Task<ActionResult> GetReady()
        {
            var healthCheckResult = await _healthCheckService.CheckHealthAsync();
            
            if (healthCheckResult.Status == HealthStatus.Healthy || healthCheckResult.Status == HealthStatus.Degraded)
            {
                return Ok(new { status = "ready" });
            }

            return StatusCode(503, new { status = "not ready" });
        }

        [HttpGet("live")]
        public ActionResult GetLive()
        {
            return Ok(new { status = "alive" });
        }
    }
}