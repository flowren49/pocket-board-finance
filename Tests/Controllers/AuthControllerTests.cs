using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using PersonalFinanceApp.Controllers;
using PersonalFinanceApp.Models;
using PersonalFinanceApp.Models.DTOs;
using Xunit;

namespace PersonalFinanceApp.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
        private readonly Mock<SignInManager<ApplicationUser>> _signInManagerMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<ILogger<AuthController>> _loggerMock;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            var store = new Mock<IUserStore<ApplicationUser>>();
            _userManagerMock = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);
            
            var contextAccessor = new Mock<IHttpContextAccessor>();
            var claimsFactory = new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>();
            var options = new Mock<Microsoft.Extensions.Options.IOptions<IdentityOptions>>();
            var logger = new Mock<ILogger<SignInManager<ApplicationUser>>>();
            _signInManagerMock = new Mock<SignInManager<ApplicationUser>>(_userManagerMock.Object, contextAccessor.Object, claimsFactory.Object, options.Object, logger.Object, null, null);

            _configurationMock = new Mock<IConfiguration>();
            _loggerMock = new Mock<ILogger<AuthController>>();

            _controller = new AuthController(
                _userManagerMock.Object,
                _signInManagerMock.Object,
                _configurationMock.Object,
                _loggerMock.Object);
        }

        [Fact]
        public async Task Register_WithValidData_ShouldReturnOkResult()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "Password123!",
                ConfirmPassword = "Password123!"
            };

            var user = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = registerDto.Email,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName
            };

            _userManagerMock.Setup(x => x.FindByEmailAsync(registerDto.Email))
                .ReturnsAsync((ApplicationUser)null);

            _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), registerDto.Password))
                .ReturnsAsync(IdentityResult.Success);

            _configurationMock.Setup(x => x["JwtSettings:ExpirationInMinutes"])
                .Returns("60");

            // Act
            var result = await _controller.Register(registerDto);

            // Assert
            Assert.IsType<ActionResult<AuthResponseDto>>(result);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var authResponse = Assert.IsType<AuthResponseDto>(okResult.Value);
            Assert.Equal(registerDto.Email, authResponse.User.Email);
        }

        [Fact]
        public async Task Register_WithExistingEmail_ShouldReturnBadRequest()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "Password123!",
                ConfirmPassword = "Password123!"
            };

            var existingUser = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                Email = registerDto.Email
            };

            _userManagerMock.Setup(x => x.FindByEmailAsync(registerDto.Email))
                .ReturnsAsync(existingUser);

            // Act
            var result = await _controller.Register(registerDto);

            // Assert
            Assert.IsType<ActionResult<AuthResponseDto>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Contains("existe déjà", badRequestResult.Value.ToString());
        }

        [Fact]
        public async Task Login_WithValidCredentials_ShouldReturnOkResult()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "john.doe@example.com",
                Password = "Password123!"
            };

            var user = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = loginDto.Email,
                Email = loginDto.Email,
                FirstName = "John",
                LastName = "Doe",
                IsActive = true
            };

            _userManagerMock.Setup(x => x.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync(user);

            _signInManagerMock.Setup(x => x.CheckPasswordSignInAsync(user, loginDto.Password, true))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);

            _userManagerMock.Setup(x => x.UpdateAsync(user))
                .ReturnsAsync(IdentityResult.Success);

            _configurationMock.Setup(x => x["JwtSettings:ExpirationInMinutes"])
                .Returns("60");

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            Assert.IsType<ActionResult<AuthResponseDto>>(result);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var authResponse = Assert.IsType<AuthResponseDto>(okResult.Value);
            Assert.Equal(loginDto.Email, authResponse.User.Email);
        }

        [Fact]
        public async Task Login_WithInvalidCredentials_ShouldReturnUnauthorized()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "john.doe@example.com",
                Password = "WrongPassword"
            };

            var user = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = loginDto.Email,
                Email = loginDto.Email,
                IsActive = true
            };

            _userManagerMock.Setup(x => x.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync(user);

            _signInManagerMock.Setup(x => x.CheckPasswordSignInAsync(user, loginDto.Password, true))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Failed);

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            Assert.IsType<ActionResult<AuthResponseDto>>(result);
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            Assert.Contains("incorrect", unauthorizedResult.Value.ToString());
        }

        [Fact]
        public async Task Login_WithNonExistentUser_ShouldReturnUnauthorized()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "nonexistent@example.com",
                Password = "Password123!"
            };

            _userManagerMock.Setup(x => x.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync((ApplicationUser)null);

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            Assert.IsType<ActionResult<AuthResponseDto>>(result);
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            Assert.Contains("incorrect", unauthorizedResult.Value.ToString());
        }
    }
}