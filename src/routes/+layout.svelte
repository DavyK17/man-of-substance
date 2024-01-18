<script>
	import "../reset.css";
	import "../app.scss";

	import { Amplify } from "aws-amplify";
	import amplifyconfig from "../amplifyconfiguration.json";

	Amplify.configure(amplifyconfig);
</script>

<slot />
