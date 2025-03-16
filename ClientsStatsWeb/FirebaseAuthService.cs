using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;

public class FirebaseAuthService
{
    private readonly FirebaseApp firebaseApp;

    public FirebaseAuthService()
    {
        firebaseApp = FirebaseApp.DefaultInstance;
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
    public async Task<string> LoginUser(string email, string password)
    {
        try
        {
            // FirebaseAdmin no permite login directo, necesitas usar el REST API de Firebase para autenticar
            string apiKey = Environment.GetEnvironmentVariable("FIREBASE_API_KEY");
            var authClient = new HttpClient();
            var response = await authClient.PostAsJsonAsync($"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={apiKey}", new
            {
                email,
                password,
                returnSecureToken = true
            });
            if (!response.IsSuccessStatusCode)
                return "Invalid credentials";
            var result = await response.Content.ReadFromJsonAsync<dynamic>();
            return $"User signed in! Token: {result.idToken}";
        }
        catch (Exception ex)
        {
            return $"Error: {ex.Message}";
        }
    }
}