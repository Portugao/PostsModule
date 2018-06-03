<?php
/**
 * Posts.
 *
 * @copyright Michael Ueberschaer (MU)
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 * @author Michael Ueberschaer <info@homepages-mit-zikula.de>.
 * @link https://homepages-mit-zikula.de
 * @link http://zikula.org
 * @version Generated by ModuleStudio (https://modulestudio.de).
 */

namespace MU\PostsModule\Entity;

use MU\PostsModule\Entity\Base\AbstractContentCategoryEntity as BaseEntity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Entity extension domain class storing content categories.
 *
 * This is the concrete category class for content entities.
 * @ORM\Entity(repositoryClass="\MU\PostsModule\Entity\Repository\ContentCategoryRepository")
 * @ORM\Table(name="mu_posts_content_category",
 *     uniqueConstraints={
 *         @ORM\UniqueConstraint(name="cat_unq", columns={"registryId", "categoryId", "entityId"})
 *     }
 * )
 */
class ContentCategoryEntity extends BaseEntity
{
    // feel free to add your own methods here
}