using System.Runtime.CompilerServices;

namespace HeartWearTizen.Services
{
    /// <summary>
    /// If you want to view logs in the development phase, you need to write log messages using this Logger.
    /// You can then view the logs on both Tizen Log Viewer and Tizen Device Manager in Tools > Tizen menu in Visual Studio.
    /// For more information, see https://docs.tizen.org/application/vstools/tools/log-viewer and https://docs.tizen.org/application/vstools/tools/device-manager.
    ///
    /// To reduce the log output, you can filter logs by Level, Tag, and so on.
    /// For more details, see https://docs.tizen.org/application/vstools/tools/log-viewer#understanding-and-filtering-logs and https://docs.tizen.org/application/vstools/tools/device-manager#understanding-and-filtering-logs.
    ///
    /// In addition, you can find the API reference for Tizen.Log in https://samsung.github.io/TizenFX/stable/api/Tizen.Log.html.
    /// Note that you can see the logs written by Console.WriteLine() or Console.Write() if filtered by 'DOTNET_LAUNCHER' tag.
    /// </summary>
    public static class Logger
    {
        /// <summary>
        /// The default tag is the name of the project
        /// </summary>
        private const string _tag = "HeartWearTizen";

        /// <summary>
        /// Write a Verbose log message
        /// </summary>
        /// <remarks>
        /// File path, function name, line number of caller and message are shown with Verbose priority
        /// </remarks>
        public static void Verbose(string message, [CallerFilePath] string file = "", [CallerMemberName] string func = "", [CallerLineNumber] int line = 0)
        {
            Tizen.Log.Verbose(_tag, message, file, func, line);
        }

        /// <summary>
        /// Write a Debug log message
        /// </summary>
        /// <remarks>
        /// File path, function name, line number of caller and message are shown with Debug priority
        /// </remarks>
        public static void Debug(string message, [CallerFilePath] string file = "", [CallerMemberName] string func = "", [CallerLineNumber] int line = 0)
        {
            Tizen.Log.Debug(_tag, message, file, func, line);
        }

        /// <summary>
        /// Write a Info log message
        /// </summary>
        /// <remarks>
        /// File path, function name, line number of caller and message are shown with Info priority
        /// </remarks>
        public static void Info(string message, [CallerFilePath] string file = "", [CallerMemberName] string func = "", [CallerLineNumber] int line = 0)
        {
            Tizen.Log.Info(_tag, message, file, func, line);
        }

        /// <summary>
        /// Write a Warn log message
        /// </summary>
        /// <remarks>
        /// File path, function name, line number of caller and message are shown with Warn priority
        /// </remarks>
        public static void Warn(string message, [CallerFilePath] string file = "", [CallerMemberName] string func = "", [CallerLineNumber] int line = 0)
        {
            Tizen.Log.Warn(_tag, message, file, func, line);
        }

        /// <summary>
        /// Write a Error log message
        /// </summary>
        /// <remarks>
        /// File path, function name, line number of caller and message are shown with Error priority
        /// </remarks>
        public static void Error(string message, [CallerFilePath] string file = "", [CallerMemberName] string func = "", [CallerLineNumber] int line = 0)
        {
            Tizen.Log.Error(_tag, message, file, func, line);
        }

        /// <summary>
        /// Write a Fatal log message
        /// </summary>
        /// <remarks>
        /// File path, function name, line number of caller and message are shown with Fatal priority
        /// </remarks>
        public static void Fatal(string message, [CallerFilePath] string file = "", [CallerMemberName] string func = "", [CallerLineNumber] int line = 0)
        {
            Tizen.Log.Fatal(_tag, message, file, func, line);
        }
    }
}
