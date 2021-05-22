using System;

using HeartWearTizen.Services;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using HeartWearTizen.Views;

[assembly: XamlCompilation(XamlCompilationOptions.Compile)]

namespace HeartWearTizen
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();
        }

        protected override void OnStart()
        {
            // Handle when your app starts
            Application.Current.MainPage = new MainPage();
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
            
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }

    }
}
