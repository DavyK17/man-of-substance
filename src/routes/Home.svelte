<script lang="ts">
	type Cover = {
		default: string;
		fallback: string;
	};

	export let cover: Cover;
	export let released: boolean;
</script>

<svelte:head>
	<title>Man of Substance - Welcome</title>
</svelte:head>

<main class="home">
	<header class="home-synopsis">
		<h1 class="date">4 November 2022</h1>
		<p>
			Hi there! My name is Davy, and this is my debut studio album <em>Man of Substance</em>,
			released under my pseudonym DVK. It's a hip hop project I'm extremely proud to have embarked
			on and released, and the second extended project on my catalogue after my debut EP
			<em><a href="https://bit.ly/NotARapperEP" target="blank" rel="noreferrer">Not a Rapper</a></em
			>.
		</p>
		<p>
			As my first full-length project, I felt it fitting to lay out <em>Man of Substance</em> as an introduction
			to me as a person and as a musician, with the tracklist divided into 3 different parts that seek
			to achieve that goal. The title of the album captures my self-image and how I would like to portray
			myself to others.
		</p>
		<p>
			The album begins with <em>Substance</em> (Part I), which acts as a window into my background, my
			personality, and my musical tastes. The tracks here explore different aspects of my life and worldview
			in order to give the listener an idea of the kind of person I am.
		</p>
		<p>
			The main presentation closes with <em>Sippin' and Trippin'</em> (Part II), which showcases my storytelling
			ability as a musician and as a comedian. It tells the story of a young man named Christopher, who
			enjoys a night out with his friends and gets arrested on his way home. Upon being released, he
			realises the police have swindled him out of his cash; he resorts to finding a “sugar mommy” to
			help him with his financial trouble in exchange for some sexual gratification, while compromising
			his sexual health in the process.
		</p>
		<p>
			The album ends with the bonus section (Part III), which consists of two previously released
			tracks that I'd like to reintroduce to new listeners (because I love them so much), as well as
			another new track.
		</p>
		<p>
			My hope is that this album fosters a continued interest in my music and my comedy (as well as
			the larger Nairobi stand-up comedy scene, which I've been a part of for over 18 months now). I
			hope you have as much fun listening to this album as I did making it, and if it resonates with
			you, I hope you also share it with your friends and family.
		</p>
		<p>
			Feel free to browse through this website I made (yes, I'm also a <a
				href="https://davyk17.github.io"
				target="_blank"
				rel="noreferrer">web developer</a
			>) to allow listeners to read through the lyrics to each song and discover all the wonderful
			people that made this album possible. I appreciate you for supporting me on my journey as an
			artist; there's plenty more to come.
		</p>
		<p class="signature">Davy Kamanzi / DVK</p>
	</header>
	<div class="home-links">
		<picture>
			<source srcSet={cover.default} type="image/webp" />
			<img class="cover-art" src={cover.fallback} alt="Man of Substance cover art" />
		</picture>
		<div class="link-buttons">
			{#if released}
				<a role="button" target="_blank" href="https://ditto.fm/man-of-substance" rel="noreferrer">
					Stream the album
				</a>
			{/if}
			<a role="button" href="/contributors">Contributors</a>
			<a role="button" href="/tracks" data-sveltekit-preload-data>Tracklist</a>
			<a role="button" href="/credits">Album credits</a>
			<a role="button" target="_blank" href="https://linktr.ee/davykamanzi" rel="noreferrer">
				Follow DVK
			</a>
		</div>
	</div>
</main>

<style lang="scss">
	.home {
		display: grid;
		grid-template: auto / 1fr 1fr;
		grid-template-areas: "links synopsis";
	}

	@media only screen and (max-width: 991px) {
		.home {
			grid-template: auto auto / auto;
			grid-template-areas: "links" "synopsis";
		}
	}

	.home-synopsis {
		grid-area: synopsis;
		padding: 0 1rem;
		.date {
			font-weight: bold;
			font-style: italic;
			margin-bottom: 1rem;
			text-transform: lowercase;
		}
		.signature {
			font-weight: bold;
			text-align: right;
		}
	}

	@media only screen and (max-width: 991px) {
		.home-synopsis {
			padding: unset;
		}
	}

	.home-links {
		grid-area: links;
		text-align: center;
		.cover-art {
			width: 300px;
			height: 300px;
			margin-bottom: 1rem;
		}
		.link-buttons {
			display: flex;
			width: 300px;
			margin: auto;
			flex-direction: column;
			a {
				width: auto;
				@extend %link-buttons;
				&:hover,
				&:focus {
					@extend %link-buttons-hover;
				}
				&:active {
					color: $red;
				}
			}
		}
	}

	@media only screen and (max-width: 340px) {
		.home-links {
			width: 100%;
			.cover-art {
				width: inherit;
				height: auto;
			}
			.link-buttons {
				width: inherit;
			}
		}
	}

	@media only screen and (max-width: 991px) {
		.home-links {
			margin-bottom: 1rem;
		}
	}

	@media only screen and (min-width: 1200px) {
		.home-links {
			margin: 0 auto;
		}
	}
</style>
