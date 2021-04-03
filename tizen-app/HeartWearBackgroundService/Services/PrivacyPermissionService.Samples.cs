using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HeartWearTizen.Services;

namespace HeartWearTizen.Services
{
    public static partial class PrivacyPermissionService
    {
        public static async Task RequestPrivacyPermissionSampleAsync()
        {
            // Note that privileges must be declared manually in manifest
            // More details at https://docs.tizen.org/application/dotnet/guides/security/requesting-permissions

            // Check whether the app has the permission
            if (PrivacyPermissionService.Check(PrivacyPrivilege.MediaStorage) == PrivacyPermissionStatus.Granted)
            {
                // the permission has already been granted
                return;
            }

            // Ask the user for the permission
            PrivacyPermissionStatus permission = await PrivacyPermissionService.RequestAsync(PrivacyPrivilege.MediaStorage);

            if (permission != PrivacyPermissionStatus.Granted)
            {
                // The permission is not granted
            }
        }
    }
}
