using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Tizen.Security;

namespace HeartWearTizen.Services
{
    /// <summary>
    ///  Specifies the status of the permission
    /// </summary>
    public enum PrivacyPermissionStatus
    {
        /// <summary>
        /// The permission has been granted.
        /// </summary>
        Granted,

        /// <summary>
        /// The permission has not been granted.
        /// </summary>
        Denied
    }

    /// <summary>
    /// Provides methods to check for and request permissions.
    /// For more information about permission approval, see https://docs.tizen.org/application/dotnet/guides/security/requesting-permissions
    /// </summary>
    public static partial class PrivacyPermissionService
    {
        /// <summary>
        /// Checks if the specified privilege has been granted
        /// </summary>
        /// <param name="privilege">The privilege name to check for</param>
        /// <returns>A status that indicates whether the permission has been granted or not</returns>
        public static PrivacyPermissionStatus Check(string privilege)
        {
            switch (PrivacyPrivilegeManager.CheckPermission(privilege))
            {
                case CheckResult.Allow:
                    return PrivacyPermissionStatus.Granted;
                case CheckResult.Deny:
                case CheckResult.Ask:
                default:
                    return PrivacyPermissionStatus.Denied;
            }
        }

        /// <summary>
        /// Asks the user to grant the permission at runtime
        /// </summary>
        /// <param name="privilege">The privilege name to check for</param>
        /// <returns>A status that indicates whether the permission has been granted or not</returns>
        public static async Task<PrivacyPermissionStatus> RequestAsync(string privilege)
        {
            switch (PrivacyPrivilegeManager.CheckPermission(privilege))
            {
                case CheckResult.Allow:
                    return PrivacyPermissionStatus.Granted;
                case CheckResult.Deny:
                case CheckResult.Ask:
                    var tcs = new TaskCompletionSource<PrivacyPermissionStatus>();
                    var response = PrivacyPrivilegeManager.GetResponseContext(privilege);
                    PrivacyPrivilegeManager.ResponseContext context = null;

                    if (response.TryGetTarget(out context))
                    {
                        context.ResponseFetched += (s, e) =>
                        {
                            PrivacyPermissionStatus result = PrivacyPermissionStatus.Denied;

                            if (e.result == RequestResult.AllowForever)
                            {
                                result = PrivacyPermissionStatus.Granted;
                            }

                            tcs.SetResult(result);
                        };
                    }

                    PrivacyPrivilegeManager.RequestPermission(privilege);

                    return await tcs.Task;
                default:
                    return PrivacyPermissionStatus.Denied;
            }
        }
    }
}
