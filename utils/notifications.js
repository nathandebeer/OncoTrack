import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function requestNotificationPermissions() {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Permission for notifications not granted.');
            return false;
        }
        return true;
    } else {
        return false;
    }
}