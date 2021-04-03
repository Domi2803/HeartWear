using System;
using System.Resources;

using Tizen.Wearable.CircularUI.Forms;

using Xamarin.Forms;

// TODO: Define the default culture of your app.
// This improves lookup performance for the first resource to load.
// For more details, see https://docs.microsoft.com/dotnet/api/system.resources.neutralresourceslanguageattribute.
[assembly: NeutralResourcesLanguage("en-US")]

namespace HeartWearTizen
{
    class TizenApplication : global::Xamarin.Forms.Platform.Tizen.FormsApplication
    {
        protected override void OnCreate()
        {
            base.OnCreate();
            LoadApplication(new App());
        }

        static void Main(string[] args)
        {
            using (var tizenApplication = new TizenApplication())
            {
                Forms.Init(tizenApplication);
                FormsCircularUI.Init();
                tizenApplication.Run(args);
            }
        }
    }
}
