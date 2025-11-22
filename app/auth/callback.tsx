import { useEffect } from 'react';
import { Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
    const router = useRouter();
    const params = useLocalSearchParams();

    useEffect(() => {
        if (params.access_token && params.refresh_token) {
            const setSession = async () => {
                await supabase.auth.setSession({
                    access_token: params.access_token as string,
                    refresh_token: params.refresh_token as string,
                });
                router.replace('/');
            };
            setSession();
        } else {
            // If no tokens, just go home, the auth listener might handle it or the user cancelled
            router.replace('/');
        }
    }, [params]);

    return <Text>Redirecting...</Text>;
}
