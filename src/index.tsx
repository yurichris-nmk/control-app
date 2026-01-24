/**
 * @component ControlApp
 * @description Componente raiz da aplicação
 *
 * Este é o ponto de entrada da aplicação. A partir daqui você pode:
 * 1. Adicionar navegação (ver /docs/QUICK-START.md)
 * 2. Adicionar providers (Theme, Auth, etc)
 * 3. Configurar rotas
 *
 * Para começar a desenvolver, siga o guia rápido:
 * @see /docs/QUICK-START.md
 */

import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ControlApp = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="p-6">
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            🏗️ Control App
          </Text>
          <Text className="text-lg text-gray-600 mb-6">
            React Native + Clean Architecture
          </Text>

          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-900 mb-3">
              📚 Documentação
            </Text>
            <Text className="text-gray-700 mb-2">
              • README: Visão geral do projeto
            </Text>
            <Text className="text-gray-700 mb-2">
              • /docs/ARCHITECTURE.md: Arquitetura detalhada
            </Text>
            <Text className="text-gray-700 mb-2">
              • /docs/QUICK-START.md: Guia de início rápido
            </Text>
            <Text className="text-gray-700 mb-2">
              • /docs/TEMPLATES.md: Templates de documentação
            </Text>
            <Text className="text-gray-700 mb-2">
              • /docs/INDEX.md: Índice completo
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-900 mb-3">
              🗂️ Estrutura
            </Text>
            <Text className="text-gray-700 mb-2">
              • presentation/ - Telas, Componentes, Hooks
            </Text>
            <Text className="text-gray-700 mb-2">
              • domain/ - Entidades, UseCases, Repositórios
            </Text>
            <Text className="text-gray-700 mb-2">
              • data/ - Models, DataSources, Implementações
            </Text>
            <Text className="text-gray-700 mb-2">
              • infrastructure/ - API, Storage, Services
            </Text>
            <Text className="text-gray-700 mb-2">
              • shared/ - Utils, Constants, Types, Theme
            </Text>
          </View>

          <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <Text className="text-blue-900 font-semibold mb-2">
              🚀 Próximo Passo
            </Text>
            <Text className="text-blue-800">
              Leia o /docs/QUICK-START.md para criar sua primeira feature!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ControlApp;
