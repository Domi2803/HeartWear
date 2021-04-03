using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;

using Tizen.Network.Connection;

namespace HeartWearTizen.Services
{
    /// <summary>
    /// This service provides guidance on using the ConnectionManager to manage network access.
    /// If your app makes network requests, do not assume network always is available on a watch.
    /// When a watch has a Bluetooth connection to a phone, the app can configure a proxy to access the internet through the phone.
    /// The app can access the internet directly if a watch's Wi-Fi or cellular network are available, but it may cause battery drain.
    /// Check if an active network exists and determine a suitable network using the ConnectionManager.
    /// More details at https://developer.samsung.com/tizen/blog/en-us/2019/08/14/tizen190814
    /// </summary>
    public partial class NetworkAccessService
    {
        /// <summary>
        /// Initializes the network access service to monitor the network state
        /// </summary>
        public NetworkAccessService()
        {
            ConnectionManager.ConnectionTypeChanged += OnConnectionTypeChanged;
        }

        private void OnConnectionTypeChanged(object sender, ConnectionTypeEventArgs e)
        {
            // TODO: Insert code to monitor the network state

            if (e.ConnectionType == ConnectionType.Disconnected)
            {
                // There is no available connectivity
            }
            else if (e.ConnectionType == ConnectionType.Ethernet)
            {
                // The watch has a Bluetooth connection to a phone and the connection is proxied through the phone
            }
            else if (e.ConnectionType == ConnectionType.Cellular)
            {
                // The watch communicates with a network through cellular network, without access to a smartphone
            }
            else if (e.ConnectionType == ConnectionType.WiFi)
            {
                // The watch communicates with a network through Wi-Fi network, without access to a smartphone
            }
        }
    }
}
