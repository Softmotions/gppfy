
# GPP preprocessor integrated into Browserify

Use in browserify CLI:
```sh
browserify -t [ gppfy -D foo=bar -D foo2=bar2 -i include_macros ] ...
```

Javascript:
```js
//#ifdef foo
...
//#endif


//#ifeq @foo bar
...
//#endif


var hereIsBar = '@foo'; // hereIsBar === 'foo'

```


HTML
```html
<!--#ifeq @foo bar -->
...

<!--#endif -->
```


[GPP preprocessor documentation](http://files.nothingisreal.com/software/gpp/gpp.html)