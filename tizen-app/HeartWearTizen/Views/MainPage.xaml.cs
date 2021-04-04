using System;

using Tizen.Wearable.CircularUI.Forms;

using Xamarin.Forms;
using System.Threading;
using System.Threading.Tasks;
using System.Net;
using System.Net.Http;
using Newtonsoft.Json;
using HeartWearTizen.Services.JSON;
using Tizen.Network.Connection;
using System.IO;

namespace HeartWearTizen.Views
{
    public partial class MainPage : ContentPage
    {
        private string linkCode = "";
        private string authToken = null;
        private bool running = true;

        public MainPage()
        {
            InitializeComponent();
            
            
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (Application.Current.Properties.ContainsKey("linkCode"))
                linkCode = Application.Current.Properties["linkCode"].ToString();

            if (Application.Current.Properties.ContainsKey("authToken"))
            {
                authToken = (string)Application.Current.Properties["authToken"].ToString();
                Login();
            }

            CheckTimer();
        }

        private async void CheckTimer()
        {
            while (running)
            {
                linkCodeText.Text = this.linkCode;
                CheckLinkCodeStatus();
                await Task.Delay(10000);
            }
        }

        public void GenerateLinkCode()
        {
            var response = GetRequest("https://europe-west1-wearosheartrate.cloudfunctions.net/generateLinkCode");

            if (response.StatusCode == HttpStatusCode.OK)
            {
                var streamReader = new StreamReader(response.GetResponseStream());
                var body = streamReader.ReadToEnd();
                streamReader.Close();
                response.Close();

                var obj = JsonConvert.DeserializeObject<GenerateLinkCodeResponse>(body);
                this.linkCode = obj.code;
                this.linkCodeText.Text = obj.code;
                if (Application.Current.Properties.ContainsKey("linkCode"))
                    Application.Current.Properties["linkCode"] = obj.code;
                else
                    Application.Current.Properties.Add("linkCode", obj.code);

                Application.Current.SavePropertiesAsync();
            }
            else
            {
                this.linkCodeText.Text = "Unknown Error";
            }
        }

        public void CheckLinkCodeStatus()
        {
            HttpWebResponse response;
            try
            {
                response = GetRequest("https://europe-west1-wearosheartrate.cloudfunctions.net/checkLink?linkCode=" + this.linkCode);
            }
            catch
            {
                GenerateLinkCode();
                return;
            }

            if (response.StatusCode == HttpStatusCode.OK)
            {
                var streamReader = new StreamReader(response.GetResponseStream());
                var body = streamReader.ReadToEnd();
                streamReader.Close();
                response.Close();

                var obj = JsonConvert.DeserializeObject<LinkStatusResponse>(body);
                authToken = obj.token;

                if(authToken != null)
                {
                    if (Application.Current.Properties.ContainsKey("authToken"))
                        Application.Current.Properties["authToken"] = obj.token;
                    else
                        Application.Current.Properties.Add("authToken", obj.token);


                    this.linkCodeText.Text = "Link success!";
                    Application.Current.SavePropertiesAsync();
                    Login();
                }
            }else
            {
                GenerateLinkCode();
            }
        }

        public void Login()
        {
            this.linkCodeText.Text = "Logging in...";
            HttpWebResponse response;
            try
            {
                response = GetRequest("https://europe-west1-wearosheartrate.cloudfunctions.net/login?token=" + this.authToken);
            }
            catch
            {
                authToken = null;
                linkCode = null;
                GenerateLinkCode();
                return;
            }

            Console.WriteLine("lulw1 " + response.StatusCode);
            if(response.StatusCode == HttpStatusCode.OK)
            {
                var streamReader = new StreamReader(response.GetResponseStream());
                var body = streamReader.ReadToEnd();
                streamReader.Close();
                response.Close();

                linkCodeText.Text = "Logged In";


                Console.WriteLine("lulw2 " + body);

                LoginResponse obj = JsonConvert.DeserializeObject<LoginResponse>(body);
                Console.WriteLine("lulw3 " + obj.ToString());
                Global.idToken = obj.idToken;
                Global.uid = obj.uid;
                Console.WriteLine("lulw4 " + obj.ToString());
                GoToStreamingPage();
            }
        }

        private async void GoToStreamingPage()
        {
            running = false;
            Application.Current.MainPage = new StreamingPage();
        }

        protected override void OnDisappearing()
        {
            base.OnDisappearing();

            if (BindingContext is IDisposable disposableBindingContext)
            {
                disposableBindingContext.Dispose();
                BindingContext = null;
            }
        }

        private HttpWebResponse GetRequest(string url)
        {
            ConnectionItem currentConnection = ConnectionManager.CurrentConnection;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(url));

            // When a watch is paired with a mobile device, we can use WebProxy.
            if (currentConnection.Type == ConnectionType.Ethernet)
            {
                string proxyAddr = ConnectionManager.GetProxy(AddressFamily.IPv4);
                WebProxy myproxy = new WebProxy(proxyAddr, true);
                request.Proxy = myproxy;
            }

            request.Method = "GET";
            return (HttpWebResponse)request.GetResponse();
        }
    }
}
