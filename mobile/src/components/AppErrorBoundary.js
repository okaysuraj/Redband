import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Status } from "./ui";
import { COLORS } from "../theme/colors";

/** Gives a recoverable screen error a clear retry action. */
export default class AppErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.paper }}>
          <Status
            error="The app could not display this screen. Please try again."
            retry={() => this.setState({ failed: false })}
          />
        </SafeAreaView>
      );
    return this.props.children;
  }
}
