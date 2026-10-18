// Render the published studio principles without continuous animation.
import React from "react";
import { ScrollView } from "react-native";
import { Label } from "./ui";

export default React.memo(function Ticker({ content }) {
  if (!content?.statements?.length) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, gap: 24 }}
    >
      {content.statements.map((statement, index) => (
        <Label key={index}>/ {statement}</Label>
      ))}
    </ScrollView>
  );
});
