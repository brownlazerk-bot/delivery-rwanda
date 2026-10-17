import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  rw: {
    translation: {
      welcome: "Muraho!",
      appName: "Yuskar Delivery",
      subtitle: "Urakenera iki ubu?",
      sendPackage: "Ohereza Ipaki",
      sendPackageDesc: "Ohereza cyangwa utegeke aho ibintu bizava n'aho bijya",
      restaurants: "Hotels & Restaurants",
      restaurantsDesc: "Tumiza ibyo kurya n'izindi serivisi z'ama-hotel",
      shops: "Ibicuruzwa n'Amaduka",
      changeLang: "Hindura Ururimi",
      checkout: "Genzura no Kwishyura",
      payMomo: "Kwishyura ukoresha telefone yawe",
      driverDashboard: "Shoferi Dashboard",
      adminPanel: "Admin Control Panel"
    }
  },
  en: {
    translation: {
      welcome: "Hello!",
      appName: "Yuskar Delivery",
      subtitle: "What do you need today?",
      sendPackage: "Send Package",
      sendPackageDesc: "Send or request package delivery anywhere",
      restaurants: "Hotels & Restaurants",
      restaurantsDesc: "Order food and services from top hotels",
      shops: "Products & Shops",
      changeLang: "Change Language",
      checkout: "Checkout & Pay",
      payMomo: "Pay with Mobile Money",
      driverDashboard: "Driver Dashboard",
      adminPanel: "Admin Control Panel"
    }
  },
  fr: {
    translation: {
      welcome: "Bonjour!",
      appName: "Yuskar Delivery",
      subtitle: "Que désirez-vous aujourd'hui?",
      sendPackage: "Envoyer un Colis",
      sendPackageDesc: "Envoyez ou demandez une livraison de colis",
      restaurants: "Hôtels & Restaurants",
      restaurantsDesc: "Commandez de la nourriture et des services",
      shops: "Produits & Magasins",
      changeLang: "Changer la Langue",
      checkout: "Paiement & Caisse",
      payMomo: "Payer via Mobile Money",
      driverDashboard: "Tableau de Bord Chauffeur",
      adminPanel: "Panneau d'Administration"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "rw", // Ururimi rw'ibanze (Default language: Ikinyarwanda)
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;