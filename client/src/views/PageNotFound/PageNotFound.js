import React from "react";
import "./PageNotFound.css"
class PageNotFound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    // console.log("getDerivedStateFromError", error);
    // return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // console.log("Errors" , error ,errorInfo );
    // logErrorToMyService(error, errorInfo);
  }

  render() {
      // You can render any custom fallback UI
      return (
        <div id="notfound">
		<div class="notfound">
			<div class="notfound-404">
				<h1>Oops!</h1>
				<h2>404 - The Page can't be found</h2>
			</div>
			<a href="#">Please hit 'Reload' on your browser in a minute to try again</a>
		</div>
	</div>

      );


    return this.props.children;
  }
}
export default PageNotFound;
