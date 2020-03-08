# Want, Words! Service?

A convenient way to get some words that you want. 

---

[Production webapp](https://wantwords.herokuapp.com)

[Global lists repository](https://github.com/rvanasa/wantwords)

---

### REST API

`GET /api/lists` - find the keys of all global lists. 

`GET /api/random/:key` - choose a random object from the given list. 

`GET /api/random/:key/:amount` - generate a bunch of random objects. 

`GET /api/source/:key` - retrieve the source code for the given list.

`POST /api/choose` - evaluate the script provided in the request body.

`POST /api/choose/:amount` - evaluate the provided script `:amount` times.

---

### File Format

Below is a quick example of the `.want` file format:

```
# I'm a comment!

I'm a string option!

I'm a {reference}!

# Start a local list with key "reference"
{> reference}
    
    # Whitespace is optional
    thing
    doodad
    doohickey

    # Choose from the global list with namespace "vekta" and key "item_noun"
    {vekta:item_noun}

    # Capitalize result
    {^vekta:boss}


# Override the global list "vekta:boss_title" with custom strings
{> vekta:boss_title}
    Chad-{vekta:boss_name}
    
    # Self-reference the top list in this file using {_}
    The "{_}"

# Start using the "vekta" namespace
{> vekta:}

    # Add some more boss titles
    {> boss_title}
        the {person_adj}
    
    # Shorthand for {> vekta:} and {> boss_title}
    {>> vekta:boss_title}
    
    # Move into a namespace
    {> adj_obj:}
        # Override "adj_obj:obj"
        {> obj}
            Thing
            Thang
            Thong
    
            # Shorthand: override these keys with the current list and then switch to the last namespace
            {! vekta:item_legendary}
            {! vekta:item_rare}
            
            {item_common}
```

---

### Developer Setup

```sh
git clone https://github.com/rvanasa/wantwords-server
cd wantwords-server
npm install
```

```sh
npm run start-dev
```s

Webapp: http://localhost:3000

API: http://localhost:8080/api/...
