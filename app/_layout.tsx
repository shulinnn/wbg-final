import { AppProvider } from "@/raceContext";
import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";
import React from "react";
import { Platform, StatusBar } from "react-native";

export default function RootLayout() {

  StatusBar.setHidden(true);

  return <AppProvider>

    <Drawer
      initialRouteName="index"
      defaultStatus="closed"
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        headerShadowVisible: false,
        drawerStyle: {
          backgroundColor: "#282B3A",
          elevation: 0,
          boxShadow: Platform.OS === "web" ? "none" : "none", // Explicitly remove shadows on web
        },
        drawerInactiveTintColor: "#FFF",
        drawerActiveTintColor: "#FFF",
      }}
    >
      <Drawer.Screen
        name="lobby/index"
        options={{ drawerLabel: "Lobby" }}
      />
      <Drawer.Screen
        name="lobby/heroes"
        options={{ drawerLabel: "Hrdinové" }}
      />
      <Drawer.Screen
        name="lobby/tavern"
        options={{ drawerLabel: "Taverna" }}
      />
      <Drawer.Screen
        name="lobby/units"
        options={{ drawerLabel: "Jednotky" }}
      />
      <Drawer.Screen
        name="lobby/shop"
        options={{ drawerLabel: "Obchod" }}
      />
      <Drawer.Screen
        name="lobby/neutralShop"
        options={{ drawerLabel: "Neutrální Obchod" }}
      />
      <Drawer.Screen
        name="lobby/blacksmith"
        options={{ drawerLabel: "Kovárna" }}
      />
      <Drawer.Screen
        name="lobby/cards"
        options={{ drawerLabel: "Karty" }}
      />
      <Drawer.Screen
        name="lobby/buildings"
        options={{ drawerLabel: "Budovy" }}
      />
      <Drawer.Screen
        name="lobby/creeps"
        options={{ drawerLabel: "Creepy" }}
      />
      <Drawer.Screen
        name="lobby/rules"
        options={{ drawerLabel: "Pravidla" }}
      />
      <Drawer.Screen
        name="index"
        options={{ drawerLabel: 'Změnit rasu' }}
      />
    </Drawer>
  </AppProvider>;
}
