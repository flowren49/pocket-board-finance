using Microsoft.Extensions.Diagnostics.HealthChecks;
using PersonalFinanceApp.Data;
using Microsoft.EntityFrameworkCore;

namespace PersonalFinanceApp.HealthChecks
{
    public static class HealthCheckExtensions
    {
        public static IServiceCollection AddCustomHealthChecks(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHealthChecks()
                .AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlite(configuration.GetConnectionString("DefaultConnection")))
                .AddCheck("database", () =>
                {
                    try
                    {
                        using var scope = services.BuildServiceProvider().CreateScope();
                        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                        var canConnect = context.Database.CanConnect();
                        return canConnect 
                            ? HealthCheckResult.Healthy("Database connection is working")
                            : HealthCheckResult.Unhealthy("Cannot connect to database");
                    }
                    catch (Exception ex)
                    {
                        return HealthCheckResult.Unhealthy($"Database health check failed: {ex.Message}");
                    }
                })
                .AddCheck("memory", () =>
                {
                    var allocated = GC.GetTotalMemory(false);
                    var data = new Dictionary<string, object>()
                    {
                        {"AllocatedBytes", allocated},
                        {"Gen0Collections", GC.CollectionCount(0)},
                        {"Gen1Collections", GC.CollectionCount(1)},
                        {"Gen2Collections", GC.CollectionCount(2)}
                    };

                    return allocated < 1000000000 // 1GB
                        ? HealthCheckResult.Healthy("Memory usage is normal", data)
                        : HealthCheckResult.Degraded("Memory usage is high", null, data);
                });

            return services;
        }
    }
}