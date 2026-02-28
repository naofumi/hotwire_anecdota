# Force cssbundling to select Bun only when a Bun lockfile exists.
# cssbundling-rails 1.4.3 treats yarn.lock as Bun-compatible, which causes
# `bin/rails test` to run Bun in projects that are not using it.
if defined?(Cssbundling::Tasks::LOCK_FILES)
  Cssbundling::Tasks::LOCK_FILES[:bun] = %w[bun.lockb bun.lock]
end
