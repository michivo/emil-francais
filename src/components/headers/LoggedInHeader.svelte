<script>
	import { currentUser } from '../../stores/currentUser';
	import { logOut } from '../../services/firebase';
</script>

<header>
    <div class="user-info">
	    <span class="current-user">{$currentUser.user?.displayName}</span>
	    <button on:click={async () => await logOut()}>Abmelden</button>
    </div>
    <nav>
        <a href="/config">Wörterliste</a>
        <a href="/learn">Lernen</a>
    </nav>
</header>

<style lang="scss" scoped>
    header {
        padding: 1rem;
        border-bottom: 1px solid #000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        span {
            font-weight: 300;
        }

        .user-info {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            border-bottom: 1px solid #ccc;
            padding-bottom: 0.5rem;
        }

        nav {
            display: flex;
            justify-content: space-between;

            a {
                text-decoration: none;
                padding: 0.5rem;
                border: 1px solid #822;
                border-radius: 0.25rem;
                color: black;
                margin-top: 0.5rem;

                &:hover, &:active {
                    background-color: #822;
                    color: white;
                }
            }
        }
    }
</style>