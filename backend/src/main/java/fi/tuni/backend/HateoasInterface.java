package fi.tuni.backend;

/**
 * Interface for HateOas compatible links.
 *
 * @author Joonas Lauhala {@literal <joonas.lauhala@tuni.fi>}
 *         Tuukka Juusela {@literal <tuukka.juusela@tuni.fi}
 * @version 20192802
 * @since   1.8
 */
public interface HateoasInterface {

    /**
     * Returns link for accessing resource in database.
     * @return Link for accessing resource in database.
     */
    String getLink();
}
