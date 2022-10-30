import { 
  useFonts, 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_900Black 
} from "@expo-google-fonts/inter";
import { StatusBar } from "react-native";
import { Background } from "./src/components/Background";
import { Loading } from "./src/components/Loading";
import { Home } from "./src/screens/Home";

export default function App() {

  const [ fontsLoading ] = useFonts({  
    Inter_400Regular, 
    Inter_600SemiBold, 
    Inter_700Bold, 
    Inter_900Black
  })

  if(!fontsLoading) {
    return 
  }

  return (
    <Background>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      { fontsLoading ? <Home /> : <Loading />}
    </Background>
  );
}
