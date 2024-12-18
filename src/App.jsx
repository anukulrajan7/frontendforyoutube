import React, { useState } from "react";

export default function YouTubeTrimmer() {
  const [videoUrl, setVideoUrl] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


    const handleDownloadClick = () => {
    if (downloadLink) {
      // Create a temporary link to trigger the download
      const link = document.createElement("a");
      link.href = downloadLink;
      link.download = "audio.mp3"; // Set the file name for the download
      link.click();
    } else {
      console.log("Download link is not available.");
    }
  };

  const handleTrim = async () => {
    // Reset previous states
    setError("");
    setDownloadLink("");
    setLoading(true);

    try {
      // Basic validation
      if (!videoUrl) {
        setError("Please enter a YouTube video URL");
        setLoading(false);
        return;
      }

      // Simple time validation
      const parseTime = (time) => {
        const parts = time.split(":").map(Number);
        if (parts.length === 3)
          return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return Number(time);
      };

      const start = parseTime(startTime);
      const end = parseTime(endTime);

      if (isNaN(start) || isNaN(end) || start >= end) {
        setError("Invalid time stamps");
        setLoading(false);
        return;
      }
   const response = await fetch("https://youtubevideodownloader-gcqv.onrender.com/download-and-trim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoUrl: videoUrl,
        startTime: start,
        endTime: end,
      }),
    });

    if (response.ok) {
      const data = await response.blob();
      const downloadUrl = URL.createObjectURL(data);
      setDownloadLink(downloadUrl);  // Store the generated blob URL
    } else {
      console.error("Error processing the video.");
    }
      // Simulate API call (replace with actual implementation)
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            YouTube Video Trimmer
          </h1>
          <p className="text-sm text-gray-500 hidden md:block">
            Trim and download YouTube videos easily
          </p>
        </div>

        {/* Form Container */}
        <div className="space-y-4">
          {/* Video URL Input */}
          <div>
            <label
              htmlFor="videoUrl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              YouTube Video URL
            </label>
            <input
              type="text"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste YouTube video link"
              className="w-full px-3 py-2 md:py-3 border border-gray-300 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         text-sm md:text-base transition-all duration-300"
            />
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Time
              </label>
              <input
                type="text"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="00:00:00"
                className="w-full px-3 py-2 md:py-3 border border-gray-300 rounded-lg shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           text-sm md:text-base transition-all duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Time
              </label>
              <input
                type="text"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="00:00:00"
                className="w-full px-3 py-2 md:py-3 border border-gray-300 rounded-lg shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           text-sm md:text-base transition-all duration-300"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg text-sm animate-pulse">
              {error}
            </div>
          )}

          {/* Trim Button */}
          <button
            onClick={handleTrim}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 md:py-3 rounded-lg 
                       hover:bg-blue-600 transition-all duration-300 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       text-sm md:text-base flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Trim Video"
            )}
          </button>

          {/* Download Link */}
          {downloadLink && (
            <div
              className="bg-green-50 border border-green-200 text-green-800 
                            px-4 py-3 rounded-lg flex flex-col md:flex-row 
                            items-center justify-between space-y-2 md:space-y-0 md:space-x-4"
            >
              <span className="text-sm truncate max-w-full">
                Your video is ready to download
              </span>
              <button
            
               onClick={handleDownloadClick}
                className="bg-green-500 text-white px-4 py-2 rounded-md 
                           text-xs hover:bg-green-600 transition-colors 
                           inline-block text-center w-full md:w-auto"
              >
                Download MP3
              </button>
            </div>
          )}
        </div>

        {/* Responsive Hint */}
        <div className="text-center text-xs text-gray-400 mt-4">
          Works on mobile and desktop
        </div>
      </div>
    </div>
  );
}
