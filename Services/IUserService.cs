using PersonalFinanceApp.Models.DTOs;

namespace PersonalFinanceApp.Services
{
    public interface IUserService
    {
        Task<bool> LoginAsync(LoginDto loginDto);
        Task<bool> RegisterAsync(RegisterDto registerDto);
        Task LogoutAsync();
        Task<bool> IsAuthenticatedAsync();
        Task<UserDto?> GetCurrentUserAsync();
        Task<string?> GetTokenAsync();
        Task<bool> RefreshTokenAsync();
    }
}