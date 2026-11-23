Optional: Place short MP4 screen recordings of your projects here (notepilot.mp4, medchain.mp4, weather.mp4, autosolver.mp4, placewise.mp4).
Keep each clip under 5 MB using FFmpeg:
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -an notepilot.mp4
