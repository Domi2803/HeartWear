using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

using Tizen.Network.Connection;

namespace HeartWearTizen.Services
{
    public partial class NetworkAccessService
    {
        /// <summary>
        /// This is a sample to demonstrate how to check the network state and connect to the internet on a watch
        /// More details about making web requests in .NET Core see
        /// https://docs.microsoft.com/en-us/dotnet/csharp/tutorials/console-webapiclient
        /// </summary>
        public async Task SendWebRequestSampleAsync()
        {
            ConnectionItem connection = ConnectionManager.CurrentConnection;

            if (connection.Type == ConnectionType.Disconnected)
            {
                // TODO: There is no available connectivity as now
                return;
            }

            HttpClientHandler handler = null;
            HttpClient client = null;

            try
            {
                handler = new HttpClientHandler();

                // When a watch has a Bluetooth connection to a phone, a proxy to access the internet through the phone is served by default
                if (connection.Type == ConnectionType.Ethernet)
                {
                    var proxy = ConnectionManager.GetProxy(AddressFamily.IPv4);
                    handler.Proxy = new WebProxy(proxy, true);
                }

                client = new HttpClient(handler);
                var response = await client.GetStringAsync(new Uri("https://api.github.com/orgs/dotnet/repos"));

                // TODO: Insert code to process the response from a web server
                Logger.Info($"response: {response}");
            }
            finally
            {
                client?.Dispose();
                handler?.Dispose();
            }
        }
    }
}
