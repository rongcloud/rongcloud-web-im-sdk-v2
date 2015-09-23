allTestFiles = []
TEST_REGEXP = /(spec|test)(\.coffee)?(\.js)?$/i

# Get a list of all the test files to include
# IE8 没有Object.keys方法，一下代码适配IE8及FF、Chrome等浏览器等
if Object.keys
  Object.keys(window.__karma__.files).forEach (file) ->

  if TEST_REGEXP.test(file)
    # Normalize paths to RequireJS module names.
    # If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    # then do not normalize the paths
    allTestFiles.push file.replace(/^\/base\/|\.js$/g, '')
else
   hasOwnProperty = Object::hasOwnProperty
   hasDontEnumBug = not (toString: null).propertyIsEnumerable("toString")
   dontEnums = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ]
   dontEnumsLength = dontEnums.length
   OwnKeys = (obj) ->
    result = []
    for prop of obj
      result.push prop  if hasOwnProperty.call(obj, prop)
    if hasDontEnumBug
      i = 0

      while i < dontEnumsLength
        result.push dontEnums[i]  if hasOwnProperty.call(obj, dontEnums[i])
        i++
    result

  importFiles = OwnKeys(window.__karma__.files);
  j=0
  filesLength = importFiles.length;
  while j<filesLength
    file = importFiles[j]
    if TEST_REGEXP.test(file)
      allTestFiles.push file.replace(/^\/base\/|\.js$/g, '')
    j++

require.config
  # Karma serves files under /base, which is the basePath from your config file
  baseUrl: "/base"

  paths:
    'RongIMLib': 'dist/RongIMLib',

  # dynamically load all test files
  deps: allTestFiles

  # we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
