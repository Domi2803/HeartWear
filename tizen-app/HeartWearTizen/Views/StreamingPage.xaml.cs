using System;

using Tizen.Wearable.CircularUI.Forms;

using Xamarin.Forms;
using HeartWearTizen.Services;
using System.Net.Http;
using System.Text;
using Tizen.System;
using Tizen.Applications;
using Tizen.Applications.Messages;
using Xamarin.Forms.PlatformConfiguration.TizenSpecific;

namespace HeartWearTizen.Views
{
    public static class Global
    {
        public static bool streamingPage = false;
        public static string idToken = "";
        public static string uid = "";
    }
    public partial class StreamingPage : ContentPage
    {
        static MessagePort messagePort;

        private HeartRateMonitorService _hrService;
        private HeartWearSyncClient _syncClient;
        private bool active;

        public StreamingPage()
        {
            InitializeComponent();

            button.On<Xamarin.Forms.PlatformConfiguration.Tizen>().SetStyle(ButtonStyle.Bottom);
            button.Clicked += Button_Clicked;


            logout.Clicked += Logout_Clicked; 

            bpmtext.Text = "- bpm";

            
            
        }

        private void Button_Clicked(object sender, EventArgs e)
        {
            active = !active;
            button.Text = active ? "Stop" : "Start";

            if (active)
            {
                Power.RequestLock(PowerLock.Cpu, 0);
                Power.RequestLock(PowerLock.DisplayNormal, 0);
                _syncClient = new HeartWearSyncClient(Global.uid, Global.idToken);
                RequestPermissionAndStart();
            }
            else
            {
                Power.ReleaseLock(PowerLock.Cpu);
                Power.ReleaseLock(PowerLock.DisplayNormal);
                _syncClient = null;
            }
        }

        private async void RequestPermissionAndStart()
        {
            var response = await PrivacyPermissionService.RequestAsync(PrivacyPrivilege.HealthInfo);
            if (response == PrivacyPermissionStatus.Granted)
            {
                _hrService = new HeartRateMonitorService();
                _hrService.Start();
                _hrService.onUpdate += _hrService_onUpdate;
            }
        }

        private void _hrService_onUpdate(byte currentHeartrate)
        {
            if(_syncClient != null)
                _syncClient.HrToSync = currentHeartrate;
            if(currentHeartrate != 0)
            {
                bpmtext.Text = currentHeartrate + " bpm";
                
            }
        }

        private void Logout_Clicked(object sender, EventArgs e)
        {
            Global.idToken = null;
            Global.uid = null;
            _syncClient = null;
            if(Xamarin.Forms.Application.Current.Properties.ContainsKey("linkCode"))
            Xamarin.Forms.Application.Current.Properties.Remove("linkCode");
            if (Xamarin.Forms.Application.Current.Properties.ContainsKey("authToken"))
                Xamarin.Forms.Application.Current.Properties.Remove("authToken");
            Xamarin.Forms.Application.Current.MainPage = new MainPage();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
        }


        protected override void OnDisappearing()
        {
            base.OnDisappearing();
        }

    }
}
