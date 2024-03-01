# Constants

This directory contains the constants used in the application.

Constants do not need to be literal values. They can be complex objects, or any other value that is used throughout the application and shared between multiple packages. So long as the value does not change, it can be considered a constant.

Some examples include database schemas, zod schemas, string literals, and more.

## When not to add a constant

If you know a value is constant, but is only required in a single package, it should not be added to this package. The reason for this is because that value can live closer to where it is used which makes it easier to find and maintain. If the value is suddenly needed in multiple packages, it can be moved to this package at that time!
