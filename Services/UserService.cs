using Blazored.LocalStorage;
using PersonalFinanceApp.Models.DTOs;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Blazored.Toast.Services;

namespace PersonalFinanceApp.Services
{
    public class UserService : IUserService
    {
        private readonly HttpClient _httpClient;
        private readonly ILocalStorageService _localStorage;
        private readonly IToastService _toastService;
        private readonly ILogger<UserService> _logger;
        
        private const string TOKEN_KEY = "authToken";
        private const string USER_KEY = "currentUser";
        
        public UserDto? CurrentUser { get; private set; }

        public UserService(
            HttpClient httpClient,
            ILocalStorageService localStorage,
            IToastService toastService,
            ILogger<UserService> logger)
        {
            _httpClient = httpClient;
            _localStorage = localStorage;
            _toastService = toastService;
            _logger = logger;
        }

        public async Task<bool> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var json = JsonSerializer.Serialize(loginDto);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("/api/auth/login", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var authResponse = JsonSerializer.Deserialize<AuthResponseDto>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (authResponse != null)
                    {
                        await _localStorage.SetItemAsync(TOKEN_KEY, authResponse.Token);
                        await _localStorage.SetItemAsync(USER_KEY, authResponse.User);
                        
                        CurrentUser = authResponse.User;
                        
                        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authResponse.Token);
                        
                        _toastService.ShowSuccess($"Bienvenue, {authResponse.User.FirstName} !");
                        return true;
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    var errorResponse = JsonSerializer.Deserialize<Dictionary<string, object>>(errorContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    var message = errorResponse?.ContainsKey("message") == true 
                        ? errorResponse["message"].ToString() 
                        : "Erreur lors de la connexion";

                    _toastService.ShowError(message ?? "Erreur lors de la connexion");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la connexion");
                _toastService.ShowError("Une erreur est survenue lors de la connexion");
            }

            return false;
        }

        public async Task<bool> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                var json = JsonSerializer.Serialize(registerDto);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("/api/auth/register", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var authResponse = JsonSerializer.Deserialize<AuthResponseDto>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (authResponse != null)
                    {
                        await _localStorage.SetItemAsync(TOKEN_KEY, authResponse.Token);
                        await _localStorage.SetItemAsync(USER_KEY, authResponse.User);
                        
                        CurrentUser = authResponse.User;
                        
                        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authResponse.Token);
                        
                        _toastService.ShowSuccess($"Compte créé avec succès, bienvenue {authResponse.User.FirstName} !");
                        return true;
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    var errorResponse = JsonSerializer.Deserialize<Dictionary<string, object>>(errorContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    var message = errorResponse?.ContainsKey("message") == true 
                        ? errorResponse["message"].ToString() 
                        : "Erreur lors de l'inscription";

                    _toastService.ShowError(message ?? "Erreur lors de l'inscription");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'inscription");
                _toastService.ShowError("Une erreur est survenue lors de l'inscription");
            }

            return false;
        }

        public async Task LogoutAsync()
        {
            try
            {
                await _httpClient.PostAsync("/api/auth/logout", null);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Erreur lors de la déconnexion côté serveur");
            }
            finally
            {
                await _localStorage.RemoveItemAsync(TOKEN_KEY);
                await _localStorage.RemoveItemAsync(USER_KEY);
                
                CurrentUser = null;
                _httpClient.DefaultRequestHeaders.Authorization = null;
                
                _toastService.ShowSuccess("Déconnexion réussie");
            }
        }

        public async Task<bool> IsAuthenticatedAsync()
        {
            var token = await GetTokenAsync();
            return !string.IsNullOrEmpty(token);
        }

        public async Task<UserDto?> GetCurrentUserAsync()
        {
            if (CurrentUser != null)
                return CurrentUser;

            try
            {
                var token = await GetTokenAsync();
                if (string.IsNullOrEmpty(token))
                    return null;

                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.GetAsync("/api/auth/me");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    CurrentUser = JsonSerializer.Deserialize<UserDto>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    
                    await _localStorage.SetItemAsync(USER_KEY, CurrentUser);
                    return CurrentUser;
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    await LogoutAsync();
                    return null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération de l'utilisateur");
            }

            return null;
        }

        public async Task<string?> GetTokenAsync()
        {
            try
            {
                return await _localStorage.GetItemAsync<string>(TOKEN_KEY);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération du token");
                return null;
            }
        }

        public async Task<bool> RefreshTokenAsync()
        {
            try
            {
                var token = await GetTokenAsync();
                if (string.IsNullOrEmpty(token))
                    return false;

                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.GetAsync("/api/auth/me");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors du rafraîchissement du token");
                return false;
            }
        }
    }
}