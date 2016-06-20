# mongodb-js-repo-list [![travis][travis_img]][travis_url] [![npm][npm_img]][npm_url]

> List repositories in a specified GitHub Organization

This module hits the Github API and returns a list of repositories in a specified organization. At the command line, it must be called with a Github oauth access token (following -t). Options include :

- `format` (json, yaml, table)
- `grep` (a word to filter the search on)
- `out` (output to file)
- `keys` (choose data about each repository to see)
- `forked` (include forked repositories)

## Usage

```javascript
mongodb-js-repo-list <organization> -t <oauth token> [options]
```

## Example

```javascript
mongodb-js-repo-list mongodb-js -t <oauth token> --format table --grep mongo
```

## License

Apache 2.0

[travis_img]: https://img.shields.io/travis/mongodb-js/mongodb-js-repo-list.svg
[travis_url]: https://travis-ci.org/mongodb-js/mongodb-js-repo-list
[npm_img]: https://img.shields.io/npm/v/mongodb-js-repo-list.svg
[npm_url]: https://npmjs.org/package/mongodb-js-repo-list
