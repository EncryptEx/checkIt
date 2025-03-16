using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Http;

namespace ClientsStatsWeb.Services
{

    public class FirebaseAuthService
    {
        private readonly FirebaseApp firebaseApp;
        private HttpClient httpClient;
        private readonly IHttpContextAccessor httpContextAccessor;

        public FirebaseAuthService(HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
        {
            firebaseApp = FirebaseApp.DefaultInstance;
            this.httpContextAccessor = httpContextAccessor;
            this.httpClient = httpClient;
        }

        // ✅ Registrar un usuario en Firebase Authentication
        public async Task<string> RegisterUser(string email, string password)
        {
            try
            {
                UserRecordArgs args = new UserRecordArgs()
                {
                    Email = email,
                    Password = password,
                    EmailVerified = false
                };
                UserRecord userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(args);
                return $"User created: {userRecord.Uid}";
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }

        // ✅ Iniciar sesión y obtener el token de usuario
        public async Task<LoginInfo> LoginUser(string email, string password)
        {
            try
            {
                string apiKey = Environment.GetEnvironmentVariable("FIREBASE_API_KEY");
                var authClient = new HttpClient();

                var response = await authClient.PostAsJsonAsync(
                    $"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={apiKey}",
                    new { email, password, returnSecureToken = true });

                if (!response.IsSuccessStatusCode)
                {
                    // More robust error handling:  Get the error message from Firebase
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return new($"Error: {errorContent}", $"Error: {errorContent}"); // Or parse the JSON for a more specific error message
                }

                // Use a concrete type for deserialization for better type safety
                var result = await response.Content.ReadFromJsonAsync<FirebaseSignInResponse>();

                if (result == null) // Check for deserialization failure
                {
                    return new ("Error: Could not parse login response", "Error: Could not parse login response");
                }

                return new(result.idToken, email); // Access the idToken property

            }
            catch (Exception ex)
            {
                return new($"Error: {ex.Message}", $"Error: {ex.Message}");
            }
        }

        public class LoginInfo
        {
            public LoginInfo(string token, string name)
            {
                this.token = token;
                this.mail = name;
            }

            public string? token { get; set; }
            public string? mail { get; set; }
        }

        // Create a class to represent the Firebase sign-in response
        public class FirebaseSignInResponse
        {
            public string? idToken { get; set; } // Or public string idToken { get; set; } depending on the Firebase response
            public string? refreshToken { get; set; }
            public string? expiresIn { get; set; }
            public string? localId { get; set; }  // ... other properties as needed
        }
    }
}