using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Net.Http;
using System.IO;
using Tizen.Network.Connection;

namespace HeartWearTizen.Services
{
    class HeartWearSyncClient
    {
        string userID;
        string idToken;
        int intervalMs = 2500;
        private long lastSyncTimestamp = 0;

        public byte HrToSync
        {
            set
            {
                var currentTimestamp = DateTimeOffset.Now.ToUnixTimeMilliseconds();
                if((currentTimestamp - lastSyncTimestamp) > intervalMs && value != hrToSync)
                {
                    hrToSync = value;
                    lastSyncTimestamp = currentTimestamp;
                    SendHR();
                }
            }
        }


        private byte hrToSync = 0;
        const string baseURL = "https://wearosheartrate-default-rtdb.europe-west1.firebasedatabase.app/";

        public HeartWearSyncClient(string uid, string idToken)
        {
            this.userID = uid;
            this.idToken = idToken;
        }

        private int previousBattery;

        public async void SendHR()
        {
            try
            {
                UpdateFields(this.hrToSync, lastSyncTimestamp, Tizen.System.Battery.Percent);
                //UpdateField("currentHR", this.hrToSync);
                //UpdateField("lastUpdateTimestamp", lastSyncTimestamp);
                //UpdateField("deviceType", "\"tizen\"");

                //var battery = Tizen.System.Battery.Percent;
                //if (battery != previousBattery) {
                //    UpdateField("currentBattery", battery);
                //    previousBattery = battery;
                //}
            }
            catch
            {

            }
        }

        

        private void UpdateFields(byte currentHR, long lastSyncTimestamp, int battery)
        {

            ConnectionItem currentConnection = ConnectionManager.CurrentConnection;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(baseURL + this.userID  + ".json?auth=" + this.idToken);
            request.Method = "PATCH";

            using (var streamWriter = new StreamWriter(request.GetRequestStream()))
            {
                streamWriter.Write("{\"currentHR\": " + currentHR.ToString() + ", \"lastUpdateTimestamp\": " + lastSyncTimestamp.ToString() + ", \"deviceType\": \"tizen\", \"currentBattery\": " + battery.ToString() + "}");
            }

            // When a watch is paired with a mobile device, we can use WebProxy.
            if (currentConnection.Type == ConnectionType.Ethernet)
            {
                string proxyAddr = ConnectionManager.GetProxy(AddressFamily.IPv4);
                WebProxy myproxy = new WebProxy(proxyAddr, true);
                request.Proxy = myproxy;
            }
            try
            {
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            }catch(Exception e)
            {
                
            }
        }
    }
}
