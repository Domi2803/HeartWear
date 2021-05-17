using Tizen.Applications;
using HeartWearTizen.Services;
using Tizen.Applications.Messages;
using Tizen.System;

namespace HeartWearBackgroundService
{
    class App : ServiceApplication
    {
        static HeartRateMonitorService _hrService;
        static MessagePort messagePort;
        static HeartWearSyncClient _syncClient;
        static string idToken;
        static string uid;

        protected override void OnCreate()
        {
            base.OnCreate();

            messagePort = new MessagePort("HeartWearSvc", false);
            messagePort.Listen();
            messagePort.MessageReceived += MessagePort_MessageReceived;

            if(Preference.Contains("idToken"))
                idToken = Preference.Get<string>("idToken");

            if(Preference.Contains("uid"))
                uid = Preference.Get<string>("uid");


            Power.RequestLock(PowerLock.Cpu, 0);
            RequestPermissionAndStart();
            _syncClient = new HeartWearSyncClient(uid, idToken);

            
        }

        private void MessagePort_MessageReceived(object sender, MessageReceivedEventArgs e)
        {
            if(e.Message.GetItem("type").ToString() == "exit")
            {
                this.Exit();
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
            else
            {
                messagePort = new MessagePort("HeartWearSvc", false);
                messagePort.Listen();
                var msgBundle = new Bundle();
                msgBundle.AddItem("type", "error");
                msgBundle.AddItem("errorType", "noPermission");
                try
                {
                    messagePort?.Send(msgBundle, "de.Domi2803.heartwear.tizenapp", "HeartWearUI", true);
                }
                catch { }
                
            }
        }

        private void _hrService_onUpdate(byte currentHeartrate)
        {
            var msgBundle = new Bundle();
            msgBundle.AddItem("currentbpm", currentHeartrate.ToString());
            try { messagePort?.Send(msgBundle, "de.Domi2803.heartwear.tizenapp", "HeartWearUI", true); } catch { }
            _syncClient.HrToSync = currentHeartrate;
            Power.RequestLock(PowerLock.Cpu, 0);
        }

        protected override void OnAppControlReceived(AppControlReceivedEventArgs e)
        {
            base.OnAppControlReceived(e);
            ReceivedAppControl receivedAppControl = e.ReceivedAppControl;

            uid = receivedAppControl.ExtraData.Get("uid").ToString();
            idToken = receivedAppControl.ExtraData.Get("idToken").ToString();

            Preference.Set("uid", uid);
            Preference.Set("idToken", idToken);

            _syncClient = new HeartWearSyncClient(uid, idToken);

            if (receivedAppControl.IsReplyRequest)
            {
                AppControl replyRequest = new AppControl();
                receivedAppControl.ReplyToLaunchRequest(replyRequest, AppControlReplyResult.Succeeded);
            }
        }

        protected override void OnDeviceOrientationChanged(DeviceOrientationEventArgs e)
        {
            base.OnDeviceOrientationChanged(e);
        }

        protected override void OnLocaleChanged(LocaleChangedEventArgs e)
        {
            base.OnLocaleChanged(e);
        }

        protected override void OnLowBattery(LowBatteryEventArgs e)
        {
            
        }

        protected override void OnLowMemory(LowMemoryEventArgs e)
        { 
        }

        protected override void OnRegionFormatChanged(RegionFormatChangedEventArgs e)
        {
            base.OnRegionFormatChanged(e);
        }

        protected override void OnTerminate()
        {
            base.OnTerminate();
            
        }

        static void Main(string[] args)
        {
            App app = new App();
            app.Run(args);
        }
    }
}
