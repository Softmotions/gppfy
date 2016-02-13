
# GPP preprocessor integrated into Browserify

Use in browserify CLI:
```sh
browserify -t [ gppfy -D foo1=bar1 -D foo2=bar2 -i include_macros ] ...
```

Javascript:
```js
//#ifdef foo
...
//#endif
```


HTML
```html
<!--#ifeq foo bar -->
...

<!--#endif -->
```


[GPP preprocessor documentation](http://files.nothingisreal.com/software/gpp/gpp.html)