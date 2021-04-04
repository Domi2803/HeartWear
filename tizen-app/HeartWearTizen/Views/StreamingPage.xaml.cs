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
        public static bool svcActive = false;
        public static string idToken = "";
        public static string uid = "";
    }
    public partial class StreamingPage : ContentPage
    {
        static MessagePort messagePort;
        
        public bool SvcActive
        {
            get { return Global.svcActive; }
            set
            {
                Global.svcActive = value;
                updateButton();
            }
        }

        AppControl appcontrol = new AppControl
        {
            ApplicationId = "de.Domi2803.heartwear.BackgroundService",
            Operation = AppControlOperations.Default
        };

        public StreamingPage()
        {
            InitializeComponent();

            try
            {
                messagePort = new MessagePort("HeartWearUI", true);
                messagePort.Listen();
                messagePort.MessageReceived += MessagePort_MessageReceived;
            }
            catch
            {

            }
           

            appcontrol.ExtraData.Add("uid", Global.uid);
            appcontrol.ExtraData.Add("idToken", Global.idToken);

            button.On<Xamarin.Forms.PlatformConfiguration.Tizen>().SetStyle(ButtonStyle.Bottom);
            button.Clicked += Button_Clicked;

            bpmtext.Text = "- bpm";

        }

        private void Launch()
        {
            AppControl.SendLaunchRequest(appcontrol, (launchRequest, replyRequest, result) =>
            {
                switch (result)
                {
                    case AppControlReplyResult.Succeeded:
                        bpmtext.Text = "- bpm";
                        break;
                    case AppControlReplyResult.Failed:
                        bpmtext.Text = "Failed";
                        SvcActive = false;
                        break;
                    case AppControlReplyResult.AppStarted:
                        bpmtext.Text = "- bpm";
                        break;
                    case AppControlReplyResult.Canceled:
                        bpmtext.Text = "- bpm";
                        SvcActive = false;
                        break;
                }
            });
        }

        private void Button_Clicked(object sender, EventArgs e)
        {
            if (SvcActive)
            {
                var bundleToSend = new Bundle();
                bundleToSend.AddItem("type", "exit");
                try
                {
                    messagePort?.Send(bundleToSend, "de.Domi2803.heartwear.BackgroundService", "HeartWearSvc", false);
                }
                catch { }
                SvcActive = false;
            }
            else
            {
                try
                {
                    Launch();
                }catch
                {

                }
            }
        }

        private void updateButton()
        {
            button.Text = Global.svcActive ? "Stop" : "Start";
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            Console.WriteLine("OnAppearing");
        }


        protected override void OnDisappearing()
        {
            base.OnDisappearing();
            messagePort?.Dispose();
            messagePort?.StopListening();
        }


        private void MessagePort_MessageReceived(object sender, MessageReceivedEventArgs e)
        {
            SvcActive = true;
            bpmtext.Text = e.Message.GetItem("currentbpm").ToString() + "bpm";
        }
    }
}
