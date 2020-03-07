# Want, Words!

A convenient way to get some words that you want. 

---

### REST API

`GET /api/lists` - find the keys of all global lists. 

`GET /api/random/:key` - choose a random object from the given list. 

`GET /api/random/:key/:amount` - generate a bunch of random objects. 

`POST /api/source/:key` - retrieve the source code for the given list.

`POST /api/choose` - parse and evaluate the script provided in the request body.

`POST /api/choose/:amount` - parse and evaluate the provided script `:amount` times.

---

### File Format

Below is a quickstart for the `.want` file format:

```
# I'm a comment!

I'm a {reference}!

# Start a local list with key "reference"
{:: reference}
    
    # Whitespace is optional
    thing
    doodad
    doohickey

    # Choose from the global list with namespace "vekta" and key "item_noun"
    {vekta:item_noun}

    # Choose from every global list with the key "obj"
    {:obj}

    # Capitalize result
    {^vekta:boss}


# Override the global list "vekta:boss_title" with custom strings
{:: vekta:boss_title}
    Chad-{vekta:boss_name}
    
    # Self-reference the top list in this file using {_}
    The "{_}"


```