module GlobalNotificationHelper
  def global_notification_stream
    turbo_stream.replace "global-notification" do
      render "global_notification"
    end
  end
end
